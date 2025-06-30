import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { PrimeInputComponent } from '../../prime-input/prime-input.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PrimeFilterDropdownComponent } from '../../prime-filter-dropdown/prime-filter-dropdown/prime-filter-dropdown.component';
import { PrimeDropdownComponent } from '../../prime-dropdown/prime-dropdown.component';
import { PrimeDatepickerComponent } from '../../prime-datepicker/prime-datepicker/prime-datepicker.component';
import { ButtonComponent } from '../../prime-button/button/button.component';
import { GetDataService } from '../../Services/get-data.service';
import { DataLoaderComponent } from '../../data-loader/data-loader.component';
import { MessageService } from 'primeng/api';
import { Toast, ToastModule } from 'primeng/toast';
import { ToastService } from '../../Services/toast.service';
import { AwardedDateLessThanToday } from '../../Validators/AwardedDateLessThanToday.validator';
import { StartDateLessThanToday } from '../../Validators/StartDateLessThanToday.validator';
import { EndDateLessThanToday } from '../../Validators/EndDateLessThanToday.validator';
import { StartDateWithEndDate } from '../../Validators/StartDateWithEndDate.validator';
import { AwardedDateWithEndDateValidator } from '../../Validators/AwardedDateWithEndDate.validator';
import { StartDateWithDOBValidator } from '../../Validators/StartDateWithDOB.validator';

@Component({
  selector: 'app-reactive-form',
  imports: [
    DialogModule,
    CommonModule,
    ButtonModule,
    PrimeInputComponent,
    ReactiveFormsModule,
    PrimeFilterDropdownComponent,
    PrimeDropdownComponent,
    PrimeDatepickerComponent,
    ButtonComponent,
    DataLoaderComponent,
    Toast,
    ToastModule,
  ],

  providers: [],
  templateUrl: './reactive-form.component.html',
  styleUrl: './reactive-form.component.scss',
})
export class ReactiveFormComponent implements OnInit, AfterViewInit, OnDestroy {
  dynamicForm: FormGroup | undefined;
  disable = signal<boolean>(false);
  loading = signal<boolean>(false);
  dataLoaded = signal<boolean>(true);

  degreeType = signal<Record<string, string>[]>([
    { type: 'Doctoral' },
    { type: 'Master' },
    { type: 'Bachelor' },
    { type: 'Diploma' },
  ]);

  studyMode = signal<Record<string, string>[]>([
    { type: 'On-campus' },
    { type: 'Online' },
    { type: 'Distance Learning' },
  ]);

  countries = signal<Record<string, string>[]>([
    { name: 'Australia' },
    { name: 'Austria' },
    { name: 'Bangaladesh' },
    { name: 'Canada' },
    { name: 'Australia' },
    { name: 'Austria' },
    { name: 'Bangaladesh' },
    { name: 'Canada' },
    { name: 'Australia' },
    { name: 'Austria' },
    { name: 'Bangaladesh' },
    { name: 'Canada' },
    { name: 'Australia' },
    { name: 'Austria' },
    { name: 'Bangaladesh' },
    { name: 'Canada' },
    { name: 'Australia' },
    { name: 'Austria' },
    { name: 'Bangaladesh' },
    { name: 'Canada' },
    { name: 'Australia' },
    { name: 'Austria' },
    { name: 'Bangaladesh' },
    { name: 'Canada' },
    { name: 'Australia' },
    { name: 'Austria' },
    { name: 'Bangaladesh' },
    { name: 'Canada' },
    { name: 'Australia' },
    { name: 'Austria' },
    { name: 'Bangaladesh' },
    { name: 'Canada' },
    { name: 'Australia' },
    { name: 'Austria' },
    { name: 'Bangaladesh' },
    { name: 'Canada' },
    { name: 'Australia' },
    { name: 'Austria' },
    { name: 'Bangaladesh' },
    { name: 'Canada' },
    { name: 'Australia' },
    { name: 'Austria' },
    { name: 'Bangaladesh' },
    { name: 'Canada' },
    { name: 'Australia' },
    { name: 'Austria' },
    { name: 'Bangaladesh' },
    { name: 'Canada' },
  ]);

  completionOptions = signal<Record<string, string>[]>([
    { label: 'No', value: 'no' },
    { label: 'Yes', value: 'yes' },
  ]);
  minDate = signal<Date | undefined>(undefined);

  @Input() visible: boolean = true;
  @Input() editData: any = {};
  @Output() onClose = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private dataServ: GetDataService,
    private toastServ: ToastService
  ) {}

  ngOnInit(): void {
    const today = new Date();
    this.minDate.set(
      new Date(today.getFullYear() - 10, today.getMonth(), today.getDate())
    );

    const dob = new Date(2012, 4, 24);
    this.dynamicForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      institution: new FormControl('', [Validators.required]),
      degreetype: new FormControl('', [Validators.required]),
      studymode: new FormControl('', [Validators.required]),
      completion: new FormControl('', [Validators.required]),
      startdate: new FormControl('', [
        Validators.required,
        StartDateLessThanToday,
        StartDateWithEndDate,
        StartDateWithDOBValidator(dob),
      ]),
      enddate: new FormControl('', [Validators.required, EndDateLessThanToday]),
      awardeddate: new FormControl('', [
        Validators.required,
        AwardedDateLessThanToday,
        AwardedDateWithEndDateValidator,
      ]),
    });
    // this.dynamicForm.get('expiry')?.setValidators([passportExpiry('dob')]);
    this.dynamicForm.get('completion')?.setValue(this.completionOptions()[1]);
    this.loadCustomValidators();

    // this.getAllCountry();
  }

  loadCustomValidators() {
    if (this.dynamicForm) {
      this.dynamicForm.get('enddate')?.valueChanges.subscribe((data) => {
        this.dynamicForm?.get('startdate')?.touched
          ? this.dynamicForm?.get('startdate')?.updateValueAndValidity()
          : '';

        this.dynamicForm?.get('awardeddate')?.touched
          ? this.dynamicForm?.get('awardeddate')?.updateValueAndValidity()
          : '';
        const awardDate = this.dynamicForm?.get('awardeddate');
        const completion = this.dynamicForm?.get('completion');
        if (completion?.value.value == 'yes' && !awardDate?.value) {
          awardDate?.setValue(data);
        }
      });

      this.dynamicForm.get('completion')?.valueChanges.subscribe((data) => {
        if (data.value == 'no') {
          this.dynamicForm?.get('enddate')?.clearValidators();
          this.dynamicForm?.get('enddate')?.updateValueAndValidity();
          this.dynamicForm?.get('enddate')?.setValue(null);

          this.dynamicForm?.get('awardeddate')?.clearValidators();
          this.dynamicForm?.get('awardeddate')?.updateValueAndValidity();
          this.dynamicForm?.get('awardeddate')?.setValue(new Date(1990, 0, 1));
        } else {
          this.dynamicForm
            ?.get('enddate')
            ?.addValidators([Validators.required, EndDateLessThanToday]);
          this.dynamicForm
            ?.get('awardeddate')
            ?.addValidators([
              Validators.required,
              AwardedDateLessThanToday,
              AwardedDateWithEndDateValidator,
            ]);
          this.dynamicForm?.get('awardeddate')?.setValue(null);
          this.dynamicForm?.get('enddate')?.setValue(null);

          const awardDate = this.dynamicForm?.get('awardeddate');
          const endDate = this.dynamicForm?.get('enddate');
          if (awardDate?.value && endDate?.value == null) {
            console.log('assadadasd');

            endDate?.setValue(awardDate.value);
          }
        }
      });
    }
  }

  ngAfterViewInit(): void {
    // console.log(this.editData);
    if (this.editData && this.editData.Id) {
      this.dataLoaded.set(false);

      setTimeout(() => {
        this.dynamicForm?.patchValue(this.editData);
        // this.dynamicForm?.get('dob')?.updateValueAndValidity();
        this.loadCustomValidators();
        this.dynamicForm?.markAllAsTouched();
        this.dynamicForm?.updateValueAndValidity();
        this.dataLoaded.set(true);
      }, 3000);
    }
  }
  ngOnDestroy(): void {
    this.editData = {};
  }
  getAllCountry() {
    this.dataServ.getCountry().subscribe((data) => {
      this.countries.set(data);
    });
  }

  onSubmit() {
    this.loading.set(true);
    console.log(this.dynamicForm?.value);

    if (this.dynamicForm?.invalid) {
      this.toastServ.showToastError(
        'Invalid',
        'There are validation issues in your submission. Please review the form and try again.'
      );

      this.loading.set(false);
    }
  }

  onHide() {
    this.onClose.emit();
  }
}
