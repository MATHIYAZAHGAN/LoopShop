import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

// Google API type declaration
declare const google: any;
interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface SignupForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {





  constructor(private router:Router){}
 isLoginMode = true;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  showSuccessMessage = false;
  successTitle = '';
  successMessage = '';

  loginData: LoginForm = {
    email: '',
    password: '',
    rememberMe: false
  };

  signupData: SignupForm = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  };

  passwordStrength = {
    width: 0,
    text: '',
    class: ''
  };

  floatingElements = [
    { icon: '🛍️', x: 20, y: 80, delay: 0 },
    { icon: '💎', x: 80, y: 70, delay: 2 },
    { icon: '👗', x: 10, y: 30, delay: 4 },
    { icon: '👟', x: 90, y: 20, delay: 6 },
    { icon: '💄', x: 60, y: 90, delay: 1 },
    { icon: '⌚', x: 30, y: 10, delay: 3 },
    { icon: '👜', x: 70, y: 50, delay: 5 }
  ];

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.clearForms();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onLogin() {
    if (!this.isLoading) {
      this.isLoading = true;
      
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        this.showSuccess('Login Successful!', 'Welcome back! You are now logged in.');
        console.log('Login data:', this.loginData);
        
        // Redirect to dashboard after success
        setTimeout(() => {
          this.hideSuccessMessage();
          // Add navigation logic here
        }, 2000);
      }, 2000);
    }
  }

  onSignup() {
    if (!this.isLoading && this.passwordsMatch()) {
      this.isLoading = true;
      
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        this.showSuccess('Account Created!', 'Your account has been created successfully. Please check your email for verification.');
        console.log('Signup data:', this.signupData);
        
        // Switch to login mode after success
        setTimeout(() => {
          this.hideSuccessMessage();
          this.isLoginMode = true;
          this.clearForms();
        }, 3000);
      }, 2000);
    }
  }

  passwordsMatch(): boolean {
    return this.signupData.password === this.signupData.confirmPassword;
  }

  checkPasswordStrength() {
    const password = this.signupData.password;
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;

    switch (strength) {
      case 0:
      case 1:
        this.passwordStrength = { width: 20, text: 'Very Weak', class: 'weak' };
        break;
      case 2:
        this.passwordStrength = { width: 40, text: 'Weak', class: 'weak' };
        break;
      case 3:
        this.passwordStrength = { width: 60, text: 'Medium', class: 'medium' };
        break;
      case 4:
        this.passwordStrength = { width: 80, text: 'Strong', class: 'strong' };
        break;
      case 5:
        this.passwordStrength = { width: 100, text: 'Very Strong', class: 'strong' };
        break;
    }
  }

  forgotPassword() {
    this.showSuccess('Reset Link Sent!', 'Please check your email for password reset instructions.');
    setTimeout(() => {
      this.hideSuccessMessage();
    }, 3000);
  }

  socialLogin(provider: string) {
    console.log(`Attempting ${provider} login`);
    if (provider === 'google') {
      this.googleLogin();
    } else {
      // Fallback for other providers
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.showSuccess(`${provider} Login Successful!`, `You are now logged in with ${provider}.`);
        setTimeout(() => {
          this.hideSuccessMessage();
        }, 2000);
      }, 1500);
    }
  }

  googleLogin() {
    console.log('Starting Google login process...');
    
    // Check if Google API is loaded
    if (typeof google === 'undefined' || !google.accounts) {
      console.error('Google API not loaded');
      alert('Google login is not available. Please try again later.');
      return;
    }

    this.isLoading = true;

    try {
      console.log('Initializing Google Sign-In...');
      
      google.accounts.id.initialize({
        client_id: '499123924701-tuutdlr75fm6bej8uuqtpc9i6g2cffkt.apps.googleusercontent.com',
        callback: (response: any) => this.handleGoogleResponse(response),
        auto_select: false,
        cancel_on_tap_outside: true
      });

      console.log('Triggering Google Sign-In prompt...');
      
      // Try prompt first
      google.accounts.id.prompt((notification: any) => {
        console.log('Prompt notification:', notification);
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log('Prompt blocked, using fallback popup method');
          this.tryPopupFallback();
        }
      });
      
    } catch (error) {
      console.error('Google login error:', error);
      this.isLoading = false;
      alert('Google login failed. Please try again.');
    }
  }

  tryPopupFallback() {
    try {
      // Create a temporary button and click it programmatically
      const tempDiv = document.createElement('div');
      tempDiv.style.display = 'none';
      document.body.appendChild(tempDiv);
      
      google.accounts.id.renderButton(tempDiv, {
        theme: 'outline',
        size: 'large'
      });
      
      // Simulate click on the rendered button
      const button = tempDiv.querySelector('div[role="button"]') as HTMLElement;
      if (button) {
        button.click();
      }
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(tempDiv);
      }, 1000);
      
    } catch (error) {
      console.error('Fallback method failed:', error);
      this.isLoading = false;
      alert('Google login is currently unavailable. Please try again later.');
    }
  }

  handleGoogleResponse(response: any) {
    console.log('Google response received:', response);
    this.isLoading = false;

    if (response.credential) {
      console.log('Google login successful');
      console.log('JWT Token:', response.credential);
      
      // Decode JWT token to get user details
      try {
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        console.log('=== GOOGLE USER DETAILS ===');
        console.log('Name:', payload.name);
        console.log('Email:', payload.email);
        console.log('Picture:', payload.picture);
        console.log('Google ID:', payload.sub);
        console.log('Email Verified:', payload.email_verified);
        console.log('Full Payload:', payload);
        console.log('========================');
        
        // Store user data (optional)
        localStorage.setItem('googleUser', JSON.stringify({
          name: payload.name,
          email: payload.email,
          picture: payload.picture,
          id: payload.sub
        }));
        
      } catch (error) {
        console.error('Error decoding JWT token:', error);
      }
      
      // Navigate to home on success
      this.router.navigate(['/home']);
      
    } else {
      console.log('Google login failed - no credential');
      alert('Google login failed. Please try again.');
    }
  }

  goHome() {
    console.log('Navigating to home page');
    // Add navigation logic here
  }

  showSuccess(title: string, message: string) {
    this.successTitle = title;
    this.successMessage = message;
    this.showSuccessMessage = true;
  }

  hideSuccessMessage() {
    this.showSuccessMessage = false;
  }

  clearForms() {
    this.loginData = {
      email: '',
      password: '',
      rememberMe: false
    };
    
    this.signupData = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    };
    
    this.passwordStrength = { width: 0, text: '', class: '' };
  }
}
