import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
}

interface Category {
  id: number;
  name: string;
  image: string;
  itemCount: number;
}
@Component({
  selector: 'app-home',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  constructor(private router:Router, @Inject(PLATFORM_ID) private platformId: Object){
    this.loadUserData();
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    if (isPlatformBrowser(this.platformId)) {
      const googleUser = localStorage.getItem('googleUser');
      if (googleUser) {
        this.user = JSON.parse(googleUser);
        this.isLoggedIn = true;
      }
    }
  }



 searchQuery = '';
  newsletterEmail = '';
  isMobileMenuOpen = false;
  activeTab = 'All';
  
  filterTabs = ['All', 'New Arrivals', 'Best Sellers', 'Sale'];
  
  categories: Category[] = [
    { id: 1, name: 'Fashion', image: '#FF6B6B', itemCount: 1250 },
    { id: 2, name: 'Electronics', image: '#4ECDC4', itemCount: 850 },
    { id: 3, name: 'Home & Living', image: '#45B7D1', itemCount: 950 },
    { id: 4, name: 'Beauty', image: '#FFA07A', itemCount: 650 },
    { id: 5, name: 'Sports', image: '#98D8C8', itemCount: 450 },
    { id: 6, name: 'Books', image: '#F7DC6F', itemCount: 750 }
  ];
  
  products: Product[] = [
    { id: 1, name: 'Premium Wireless Headphones', price: 299, originalPrice: 399, image: '#667eea', rating: 4.8, reviews: 128, badge: 'Sale' },
    { id: 2, name: 'Smart Fitness Watch', price: 199, image: '#764ba2', rating: 4.6, reviews: 89 },
    { id: 3, name: 'Designer Handbag', price: 89, originalPrice: 129, image: '#f093fb', rating: 4.9, reviews: 203, badge: 'New' },
    { id: 4, name: 'Bluetooth Speaker', price: 79, image: '#f5576c', rating: 4.5, reviews: 156 },
    { id: 5, name: 'Skincare Set', price: 59, originalPrice: 89, image: '#4facfe', rating: 4.7, reviews: 94, badge: 'Sale' },
    { id: 6, name: 'Running Shoes', price: 149, image: '#43e97b', rating: 4.4, reviews: 167 },
    { id: 7, name: 'Coffee Maker', price: 129, originalPrice: 179, image: '#38f9d7', rating: 4.6, reviews: 78, badge: 'Sale' },
    { id: 8, name: 'Yoga Mat', price: 39, image: '#ffecd2', rating: 4.5, reviews: 134, badge: 'New' }
  ];

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }


  isCardOpen = false;
  isLoggedIn = false;
  user: any = {
    name: '',
    email: '',
    picture: ''
  };

  toggleAccountCard() {
    this.isCardOpen = !this.isCardOpen;
  }

  login() {
    this.router.navigate(['/login']);
    this.isCardOpen = false;
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('googleUser');
    }
    this.isLoggedIn = false;
    this.isCardOpen = false;
    this.user = { name: '', email: '', picture: '' };
  }



  accoundetail(){
    console.log("checking 12345678")
  }

  selectCategory(category: Category) {
    console.log('Selected category:', category.name);
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  getFilteredProducts(): Product[] {
    if (this.activeTab === 'All') {
      return this.products;
    } else if (this.activeTab === 'New Arrivals') {
      return this.products.filter(p => p.badge === 'New');
    } else if (this.activeTab === 'Best Sellers') {
      return this.products.filter(p => p.reviews > 150);
    } else if (this.activeTab === 'Sale') {
      return this.products.filter(p => p.badge === 'Sale');
    }
    return this.products;
  }

  getCategoryIcon(categoryName: string): string {
    const icons: { [key: string]: string } = {
      'Fashion': '👗',
      'Electronics': '📱',
      'Home & Living': '🏠',
      'Beauty': '💄',
      'Sports': '⚽',
      'Books': '📚'
    };
    return icons[categoryName] || '🛍️';
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  viewProduct(product: Product) {
    console.log('Viewing product:', product.name);
  }

  addToWishlist(product: Product) {
    console.log('Added to wishlist:', product.name);
  }

  addToCart(product: Product) {
    console.log('Added to cart:', product.name);
  }

  quickView(product: Product) {
    console.log('Quick view:', product.name);
  }

  subscribeNewsletter() {
    if (this.newsletterEmail) {
      console.log('Subscribed to newsletter:', this.newsletterEmail);
      this.newsletterEmail = '';
    }








  
}}