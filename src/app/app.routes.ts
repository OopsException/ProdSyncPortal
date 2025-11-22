import { Routes } from '@angular/router';

import { Layout } from './layout/layout';
import { Items } from './items/items';
import { Suppliers } from './suppliers/suppliers';
import { Products } from './products/products';
import { ProductForm } from './products/product-form/product-form';
import { ItemForm } from './items/item-form/item-form';
import { SupplierForm } from './suppliers/supplier-form/supplier-form';
import { ProductCogs } from './products/product-cogs/product-cogs';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: 'items', component: Items },
      { path: 'items/create', component: ItemForm },
      { path: 'items/:id/edit', component: ItemForm },

      { path: 'suppliers', component: Suppliers },
      { path: 'suppliers/create', component: SupplierForm },
      { path: 'suppliers/:id/edit', component: SupplierForm },

      // Products route
      { path: 'products', component: Products },
      { path: 'products/create', component: ProductForm },
      { path: 'products/:id/edit', component: ProductForm },
      { path: 'products/:id/cogs', component: ProductCogs },

      // { path: '', redirectTo: 'items', pathMatch: 'full' }
    ]
  }
];
