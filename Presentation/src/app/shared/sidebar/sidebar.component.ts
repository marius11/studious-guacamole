import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {

  items = [
    { title: "Students", path: "app/students", icon: "" },
    { title: "Courses", path: "app/courses", icon: "" }
  ];

  constructor() { }

  ngOnInit(): void { }
}
