import {
  Component, Input, Output, EventEmitter,
  ElementRef, ViewChild, Renderer,
  forwardRef, OnInit
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

const INLINE_EDIT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InlineEditComponent),
  multi: true
};

@Component({
  selector: "app-inline-edit",
  templateUrl: "./inline-edit.component.html",
  providers: [INLINE_EDIT_CONTROL_VALUE_ACCESSOR],
  styleUrls: ["./inline-edit.component.css"]
})

export class InlineEditComponent implements ControlValueAccessor, OnInit {

  @ViewChild("inlineEditControl") inlineEditControl: ElementRef;

  @Input() disabled = false;
  @Output() onSave: EventEmitter<any> = new EventEmitter();

  private currentValue = "";
  private previousValue = "";
  private editing = false;

  public onChange: any = Function.prototype;
  public onTouched: any = Function.prototype;

  get value(): any { return this.currentValue; }

  set value(v: any) {
    if (v !== this.currentValue) {
      this.currentValue = v;
      this.onChange(v);
    }
  }

  constructor(element: ElementRef, private _renderer: Renderer) { }

  ngOnInit() {
  }

  writeValue(value: any): void {
    this.currentValue = value;
  }

  public registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  enableEdit(value: string): void {
    this.editing = true;
    this.previousValue = value;
  }

  disableEdit(): void {
    this.editing = false;
    this.currentValue = this.previousValue;
  }

  saveChanges(): void {
    if (this.currentValue === this.previousValue) {
      this.editing = false;
    } else {
      this.onSave.emit();
      this.currentValue = this.value;
      this.editing = false;
    }
  }
}
