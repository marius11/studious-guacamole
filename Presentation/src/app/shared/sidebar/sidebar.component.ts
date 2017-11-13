import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {

  private items = [
    { title: "Students", path: "demo/students", icon: "" },
    { title: "Courses", path: "demo/courses", icon: "" }
  ];

  constructor() { }

  ngOnInit() { }
}
