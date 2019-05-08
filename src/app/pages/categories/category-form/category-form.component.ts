import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router"

import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

import { switchMap } from 'rxjs/operators';

import toastr from 'toastr';
import { } from '../shared/category.model';
@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  sererErrorMessages: string[] = null;
  submittingForm: boolean = false;
  category: Category = new Category();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuider: FormBuilder,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }


  // Private methods

  /**
   * Verifica qual ação é executada edição ou adição.
   */
  private setCurrentAction() {
    this.currentAction = (this.route.snapshot.url[0].path == 'new') ? 'new' : 'edit';
  }

  /**
   * Constroe o formulario.
   */
  private buildCategoryForm() {
    this.categoryForm = this.formBuider.group({
      id: [null],
      name: [null, Validators.required, Validators.minLength(2)],
      description: [null]
    });
  }

  /**
   * Busca e um objeto para edição.
   */
  private loadCategory() {
    if (this.currentAction == 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get('id')))
      )
        .subscribe(
          (category) => {
            this.category = category;
            this.categoryForm.patchValue(category) // binds loaded category data to CategoryForms
          },
          (error) => alert('Ocorreu um erro, tente mais tarde!')
        )
    }
  }


  /**
   * Seta o titulo da pagina
   */
  private setPageTitle() {
    if (this.currentAction == 'new') {
      this.pageTitle = 'Cadastro de nova categoria';
    } else {
      const categoryName = this.category.name || '...';

      this.pageTitle = 'Editando categoria: ' + categoryName;
    }
  }
}
