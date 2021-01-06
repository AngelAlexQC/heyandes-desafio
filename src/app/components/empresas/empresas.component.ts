import { Component, OnDestroy, OnInit } from "@angular/core";
import { AngularFirestoreCollection, AngularFirestore } from "@angular/fire/firestore";
import { Observable, Subject } from "rxjs";
import { Sale } from "src/app/models/sale";

@Component({
  selector: "app-empresas",
  templateUrl: "./empresas.component.html",
  styleUrls: ["./empresas.component.scss"],
})
export class EmpresasComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  private salesCollection: AngularFirestoreCollection<Sale>;
  sales: Observable<Sale[]>;
  ventas: Sale[] = [];

  constructor(private afs: AngularFirestore) {
    this.salesCollection = afs.collection<Sale>("sales");
    this.sales = this.salesCollection.valueChanges();
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: "simple",
      processing: true,
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json",
      },
      order: [1, 0],
      destroy: true,
    };
    this.getTotalSales();
  }

  getTotalSales() {
    const me = this;
    this.sales.subscribe((ventas: Sale[]) => {
      ventas.reduce(function (res, value) {
        if (!res[value.nameAgency]) {
          res[value.nameAgency] = { nameAgency: value.nameAgency, finalPrice: 0 };
          me.ventas.push(res[value.nameAgency]);
        }
        res[value.nameAgency].finalPrice += value.finalPrice;
        return res;
      }, {});
      // Necesario para DataTables
      this.dtTrigger.next();
    });
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
