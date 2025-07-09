import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
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
import { DataLoaderComponent } from '../../data-loader/data-loader.component';
import { ToastModule } from 'primeng/toast';
import { ToastService } from '../../Services/toast.service';
import { DateComparer } from '../../Validators/DateComparer.validator';
import { FormControlDateComparer } from '../../Validators/FormControlDateComparer.validator';
import { FormControlDateDifference } from '../../Validators/FormControlDateDifference.validator';

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
  customErrors: Record<string, string[]> = {};
  today: Date = new Date();

  degreeType = signal<Record<string, string>[]>([
    { type: 'Associate Degree' },
    { type: 'Bachelor' },
    { type: 'Certificate' },
    { type: 'Course' },
    { type: 'Degree type not stated in the qualification' },
    { type: 'Diploma' },
    { type: 'Fellowship' },
    { type: 'Internship' },
    { type: 'Masters' },
    { type: 'Membership' },
    { type: 'PHD' },
    { type: 'Secondary School Certificate' },
    { type: 'Training' },
    { type: 'Training Course' },
  ]);

  studyMode = signal<Record<string, string>[]>([
    { type: 'Online' },
    { type: 'Distance learning' },
    { type: 'In-Person/classroom learning' },
    { type: 'Full Time' },
    { type: 'Hybrid' },
    { type: 'Affiliation' },
    { type: 'Blended learning' },
    { type: 'Research' },
    { type: 'Open Learning' },
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
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ]);
  minDate = signal<Date | undefined>(undefined);

  editData: any = {};

  private _fb: FormBuilder = inject(FormBuilder);
  private _toastServ: ToastService = inject(ToastService);
  private _ref: DynamicDialogRef = inject(DynamicDialogRef);
  private _config: DynamicDialogConfig = inject(DynamicDialogConfig);

  ngOnInit(): void {
    this.minDate.set(
      new Date(
        this.today.getFullYear() - 10,
        this.today.getMonth(),
        this.today.getDate()
      )
    );

    const dob = new Date(2012, 4, 24);
    this.dynamicForm = this._fb.group(
      {
        name: ['', [Validators.required]],
        title: ['', [Validators.required]],
        country: ['', [Validators.required]],
        institution: ['', [Validators.required]],
        degreetype: ['', [Validators.required]],
        studymode: ['', [Validators.required]],
        completion: ['', [Validators.required]],
        startdate: [
          '',
          [
            Validators.required,
            // NotGreaterThanToday,
            DateComparer(
              this.today,
              'lte',
              'Start date cannot be greater than today.'
            ),
            DateComparer(
              dob,
              'gt',
              'Start Date should be greater than date of birth.'
            ),
            // StartDateWithDOBValidator(dob),
          ],
        ],
        enddate: [
          '',
          [
            Validators.required,
            // NotGreaterThanToday,
            DateComparer(
              this.today,
              'lte',
              'End date cannot be greater than today.'
            ),
            
          ],
        ],
        awardeddate: [
          '',
          [
            Validators.required,
            // NotGreaterThanToday
            DateComparer(
              this.today,
              'lte',
              'Date of award cannot be greater than today.'
            ),
          ],
        ],
      },
      {
        validators: [
          // StartDateWithEndDate,
          FormControlDateComparer(
            'startdate',
            'enddate',
            'lt',
            'Start date cannot be greater than end date.'
          ),
          FormControlDateComparer(
            'enddate',
            'startdate',
            'gt',
            'End date cannot be less than start date.'
          ),
          FormControlDateDifference(
            'enddate',
            'startdate',
            1,
            'day',
            'gte',
            'The gap between End date and Start Date should be minimum 1 day.'
          ),
          FormControlDateComparer(
            'awardeddate',
            'enddate',
            'gte',
            'Date of award cannot be less than End date'
          ),
          FormControlDateComparer(
            'enddate',
            'awardeddate',
            'lte',
            'End date cannot be greater than Date of award'
          ),
          // AwardedDateWithEndDateValidator
        ],
      }
    );
    // this.dynamicForm.get('expiry')?.setValidators([passportExpiry('dob')]);
    this.dynamicForm.get('completion')?.setValue(this.completionOptions()[0]);
    this.loadCustomValidators();

    // this.getAllCountry();
  }

  loadCustomValidators() {
    this.customErrors['startdate'] = ['FormControlDateComparerLt'];
    this.customErrors['enddate'] = [
      'FormControlDateDifferenceGte',
      'FormControlDateComparerGt',
      'FormControlDateComparerLte',
    ];
    this.customErrors['awardeddate'] = ['FormControlDateComparerGte'];

    if (this.dynamicForm) {
      // this.dynamicForm.get('enddate')?.valueChanges.subscribe((data) => {
      //   // this.dynamicForm?.get('startdate')?.touched
      //   //   ? this.dynamicForm?.get('startdate')?.updateValueAndValidity()
      //   //   : '';

      //   // this.dynamicForm?.get('awardeddate')?.touched
      //   //   ? this.dynamicForm?.get('awardeddate')?.updateValueAndValidity()
      //   //   : '';
      //   const awardDate = this.dynamicForm?.get('awardeddate');
      //   const completion = this.dynamicForm?.get('completion');
      //   if (completion?.value.value == 'yes' && !awardDate?.value) {
      //     awardDate?.setValue(data);
      //   }
      // });

      this.dynamicForm.get('awardeddate')?.valueChanges.subscribe((data) => {
        const endDate = this.dynamicForm?.get('enddate');
        const completion = this.dynamicForm?.get('completion');
        if (completion?.value.value == 'yes' && !endDate?.value) {
          endDate?.setValue(data);
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

          this.dynamicForm?.hasValidator(
            FormControlDateComparer(
              'awardeddate',
              'enddate',
              'gte',
              'Date of award cannot be less than End date'
            )
          )
            ? this.dynamicForm.removeValidators(
                FormControlDateComparer(
                  'awardeddate',
                  'enddate',
                  'gte',
                  'Date of award cannot be less than End date'
                )
              )
            : '';
        } else {
          this.dynamicForm
            ?.get('enddate')
            ?.addValidators([
              Validators.required,
              DateComparer(
                this.today,
                'lte',
                'End date cannot be greater than today.'
              ),
            ]);
          this.dynamicForm
            ?.get('awardeddate')
            ?.addValidators([
              Validators.required,
              DateComparer(
                this.today,
                'lte',
                'Date of award cannot be greater than today.'
              ),
            ]);

          this.dynamicForm?.hasValidator(
            FormControlDateComparer(
              'awardeddate',
              'enddate',
              'gte',
              'Date of award cannot be less than End date'
            )
          )
            ? ''
            : this.dynamicForm?.addValidators(
                FormControlDateComparer(
                  'awardeddate',
                  'enddate',
                  'gte',
                  'Date of award cannot be less than End date'
                )
              );

          this.dynamicForm?.get('awardeddate')?.setValue(null);
          this.dynamicForm?.get('enddate')?.setValue(null);
        }
      });
    }
  }

  ngAfterViewInit(): void {
    // console.log(this.editData);
    this.editData = this._config?.data;
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

  onSubmit() {
    this.loading.set(true);
    console.log(this.dynamicForm?.value);

    if (this.dynamicForm?.invalid) {
      this._toastServ.showToastError(
        'Invalid',
        'There are validation issues in your submission. Please review the form and try again.'
      );

      this.loading.set(false);
    } else {
      this._ref.close(this.dynamicForm?.value);
    }
  }
}
