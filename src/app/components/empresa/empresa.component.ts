import { Component, OnDestroy, OnInit } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { ActivatedRoute } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { Sale } from "src/app/models/sale";

@Component({
  selector: "app-empresa",
  templateUrl: "./empresa.component.html",
  styleUrls: ["./empresa.component.scss"],
})
export class EmpresaComponent implements OnInit, OnDestroy {
  agencyName: string;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  private salesCollection: AngularFirestoreCollection<Sale>;
  sales: Observable<Sale[]>;
  ventas: Sale[] = [];
  constructor(private afs: AngularFirestore, private route: ActivatedRoute) {
    this.salesCollection = afs.collection<Sale>("sales");
    this.sales = this.salesCollection.valueChanges();
  }

  ngOnInit(): void {
    this.agencyName = this.route.snapshot.paramMap.get("nombre");
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
        if (venta.nameAgency == this.agencyName) {
          this.ventas.push(venta);
        }
      });
      // Necesario para DataTables
      this.dtTrigger.next();
    });
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
