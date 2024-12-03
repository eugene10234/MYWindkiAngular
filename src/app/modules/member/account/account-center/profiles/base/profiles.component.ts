import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MemberserviceService } from '../../../memberservices/memberservice.service';
import { catchError, of } from 'rxjs';

interface ProfileData {
  username: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: Date;
  districtId: number;
}

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})
export class ProfilesComponent implements OnInit {
  profileForm!: FormGroup;
  username: string = '';
  private memberservice = inject(MemberserviceService);

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit() {
    this.loadProfileData();
  }

  private initForm() {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      gender: ['private', Validators.required],
      birthDate: [null, Validators.required],
      districtId: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
    });
  }

  private loadProfileData() {
    this.memberservice.profileOninit().pipe(
      catchError(err => {
        console.error('載入個人資料失敗:', err);
        return of(null);
      })
    ).subscribe((response: any) => {
      if (response?.success) {
        const data = response.data;
        this.username = data.userAccount;

        this.profileForm.patchValue({
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          birthDate: new Date(data.birthDate),
          districtId: data.districtId
        });
      } else {
        console.error('載入個人資料失敗:', response?.message);
      }
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const formData: ProfileData = {
        username: this.username,
        ...this.profileForm.value
      };
      console.log(formData);
      this.memberservice.updateProfile(formData).pipe(
        catchError(err => {
          alert('更新個人資料失敗:' + err);
          return of(null);
        })
      ).subscribe(response => {
        if (response?.success) {
          alert('個人資料更新成功');
          // 可以加入成功提示
        } else {
          alert('更新個人資料失敗:'+ response?.message);
          // 可以加入錯誤提示
        }
      });
    }
  }
}
