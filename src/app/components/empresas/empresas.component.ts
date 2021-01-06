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
  meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  mesSeleccionado: any = null;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  private salesCollection: AngularFirestoreCollection<Sale>;
  sales: Observable<Sale[]>;
  ventas: Sale[] = [];
  masVentas: Sale = null;
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
    let mayor = 0;
    const me = this;
    this.sales.subscribe((ventas: Sale[]) => {
      // Sumar ventas y Obtener la más alta en ventas
      ventas.reduce(function (res, value) {
        if (!res[value.nameAgency]) {
          res[value.nameAgency] = { nameAgency: value.nameAgency, finalPrice: 0 };
          me.ventas.push(res[value.nameAgency]);
        }
        res[value.nameAgency].finalPrice += value.finalPrice;
        if (res[value.nameAgency].finalPrice > mayor) {
          mayor = res[value.nameAgency].finalPrice;
          me.masVentas = res[value.nameAgency];
        }
        return res;
      }, {});
      // Buscar el mes con mas ventas
      let x = [];
      let y = null;
      mayor = 0;
      let mesAgrupado = ventas.reduce((res, value) => {
        let mes = new Date(value.day + " ").getMonth();
        if (!res[mes]) {
          res[mes] = { month: mes, finalPrice: 0 };
          x.push(res[mes]);
        }
        res[mes].finalPrice += value.finalPrice;
        if (res[mes].finalPrice > mayor) {
          mayor = res[mes].finalPrice;
          y = res[mes];
        }
        return res;
      }, {});
      this.mesSeleccionado = Object.values(mesAgrupado).reduce(function (prev: Sale, current: Sale) {
        return prev.finalPrice > current.finalPrice ? prev : current;
        // @ts-ignore
      });

      // Necesario para DataTables
      this.dtTrigger.next();
    });
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
