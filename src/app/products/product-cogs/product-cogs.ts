import { Component } from '@angular/core';
import { ApiService } from '../../core/api';
import { SharedModule } from '../../shared/shared.module';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-cogs',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './product-cogs.html',
})
export class ProductCogs {

  displayedColumns = ['quantity', 'name', 'price', 'weight', 'shippingCost', 'landedCost'];
  showBackButton = true;
  product: any;

  offerColumns = ['name', 'quantity', 'unitCost', 'delivery', 'totalCost', 'sellingPrice', 'grossProfit',
    'grossMargin', 'roas', 'targetCAC', 'netProfit', 'netMargin'
  ];
  offers: any[] = [];

  constructor(
    private api: ApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const productId = Number(this.route.snapshot.paramMap.get('id'));

    this.api.get(`/product/${productId}`).subscribe((res: any) => {
      this.product = res;
    });

    this.api.get(`/offer/product/${productId}?unitEconomics=true`).subscribe((res: any) => {
      this.offers = Array.isArray(res) 
      ? res 
      : (res?.data ?? res?.items ?? []);
    });
  }

  goBack() {
    history.back();
  }
}
