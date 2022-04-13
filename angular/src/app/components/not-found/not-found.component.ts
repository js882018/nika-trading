import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  constructor(private service: CommonService, private router: Router, private activatedRouter: ActivatedRoute, private loader: NgxSpinnerService) {
    this.service.setTitle('Not Found | Demo App');
  }

  ngOnInit(): void {
  }

}
