import { Component, OnDestroy, OnInit } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { Observable, Subject } from "rxjs";
import { Sale } from "src/app/models/sale";

@Component({
  selector: "app-empresa",
  templateUrl: "./empresa.component.html",
  styleUrls: ["./empresa.component.scss"],
})
export class EmpresaComponent implements OnInit, OnDestroy {
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
      destroy: true,
    };
    this.getSales();
  }

  getSales() {
    const me = this;
    this.sales.subscribe((ventas: Sale[]) => {
      this.ventas = [];
      ventas.forEach((venta) => {
        this.ventas.push(venta);
      });
      // Necesario para DataTables
      this.dtTrigger.next();
    });
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
