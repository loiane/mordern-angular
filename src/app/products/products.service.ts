import { Injectable, inject } from '@angular/core';
import { Product } from './product';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private products: Product[] = [];

  private readonly API = `/products`;
  private readonly isLocal = true;
  private readonly http = inject(HttpClient);

  load(): Observable<Product[]> {
    if (this.isLocal) {
      for (let num = 1; num <= 10; num++) {
        this.addProducts(num);
      }
      return of(this.products);
    }
    return this.http.get<Product[]>(this.API);
  }

  create(product: Product): Observable<Product> {
    if (this.isLocal) {
      product.id = this.rescueLastId();
      this.products.push(product);
      return of(product);
    }
    return this.http.post<Product>(this.API, product);
  }

  private addProducts(i: number): void {
    this.products.push({
      id: `${i}`,
      price: parseFloat((Math.random() * (0.0 - 10.0) + 10.0).toFixed(2)),
      status: ['', '', '', 'sale'][Math.floor(Math.random() * 4)],
      discounted: ['', '', '', 'discounted'][Math.floor(Math.random() * 4)],
      discount: parseFloat((Math.random() * (0.0 - 10.0) + 10.0).toFixed(2)),
      name: ['Coffee'][Math.floor(Math.random() * 1)],
      description: ['B & W', 'Grey', 'Black', 'Green', 'Black'][Math.floor(Math.random() * 5)],
      image: `${i}`
    });
  }

  private rescueLastId(): string {
    if (this.products.length === 0) {
      return '1';
    }
  
    const maxId = Math.max(...this.products.map(p => parseInt(p.id, 10) || 0));
    const newId = (maxId + 1).toString();
    
    return newId;
  }
}
