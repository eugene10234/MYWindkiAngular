import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent implements OnInit {
  currentAvatar: string | null = null;
  selectedFile: File | null = null;
  defaultAvatar = 'assets/images/default-avatar.png';
  isDragOver = false;

  constructor() {}

  ngOnInit(): void {
    this.loadCurrentAvatar();
  }

  loadCurrentAvatar() {
    // 模擬從API獲取當前頭像
    this.currentAvatar = 'assets/images/sample-avatar.jpg';
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  handleFile(file: File) {
    if (this.validateFile(file)) {
      this.selectedFile = file;
      this.previewFile(file);
    }
  }

  validateFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!validTypes.includes(file.type)) {
      alert('只支援 JPG 或 PNG 格式的圖片');
      return false;
    }

    if (file.size > maxSize) {
      alert('檔案大小不能超過 2MB');
      return false;
    }

    return true;
  }

  previewFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.currentAvatar = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  resetAvatar() {
    this.selectedFile = null;
    this.loadCurrentAvatar();
  }

  uploadAvatar() {
    if (this.selectedFile) {
      // 實作上傳邏輯
      console.log('上傳頭像：', this.selectedFile);
    }
  }
}
