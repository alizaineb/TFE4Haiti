(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
  ["main"], {

    /***/
    "./src/$$_lazy_route_resource lazy recursive":
      /*!**********************************************************!*\
        !*** ./src/$$_lazy_route_resource lazy namespace object ***!
        \**********************************************************/
      /*! no static exports found */
      /***/
      (function(module, exports) {

        function webpackEmptyAsyncContext(req) {
          // Here Promise.resolve().then() is used instead of new Promise() to prevent
          // uncaught exception popping up in devtools
          return Promise.resolve().then(function() {
            var e = new Error('Cannot find module "' + req + '".');
            e.code = 'MODULE_NOT_FOUND';
            throw e;
          });
        }
        webpackEmptyAsyncContext.keys = function() { return []; };
        webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
        module.exports = webpackEmptyAsyncContext;
        webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

        /***/
      }),

    /***/
    "./src/app/_components/admin-panel/admin-panel.component.css":
      /*!*******************************************************************!*\
        !*** ./src/app/_components/admin-panel/admin-panel.component.css ***!
        \*******************************************************************/
      /*! no static exports found */
      /***/
      (function(module, exports) {

        module.exports = "i:hover {\r\n  cursor: pointer;\r\n}\r\n\r\n.fa-check {\r\n  color: green;\r\n}\r\n\r\n.fa-trash {\r\n  color: red;\r\n}"

        /***/
      }),

    /***/
    "./src/app/_components/admin-panel/admin-panel.component.html":
      /*!********************************************************************!*\
        !*** ./src/app/_components/admin-panel/admin-panel.component.html ***!
        \********************************************************************/
      /*! no static exports found */
      /***/
      (function(module, exports) {

        module.exports = "<h1>\r\n  Utilisateur(s) en attente de validation\r\n</h1>\r\n<table class=\"table table-striped table-bordered\">\r\n  <thead>\r\n    <tr>\r\n      <th>#</th>\r\n      <th *ngFor=\"let head of headers\">\r\n\r\n        {{head}}\r\n        <i class=\"fa fa-sort float-right\" aria-hidden=\"true\" (click)=\"sortData(head)\"></i>\r\n      </th>\r\n      <th>Action</th>\r\n    </tr>\r\n  </thead>\r\n  <tbody>\r\n    <tr *ngFor=\"let user of users; index as i;\">\r\n      <td>{{i+1}}</td>\r\n      <td>{{user.first_name}}</td>\r\n      <td>{{user.last_name}}</td>\r\n      <td>{{user.mail}}</td>\r\n      <td>{{user.niceDate}}</td>\r\n      <td>\r\n        <i class=\"fas fa-check fa-fw fa-1x\" (click)=\"acceptUser(user._id)\"></i>\r\n        <i class=\"fas fa-trash fa-fw fa-1x\" data-toggle=\"modal\" (click)=\"setCurrUser(user._id)\" data-target=\" #refuseUserModal\"></i>\r\n      </td>\r\n    </tr>\r\n  </tbody>\r\n</table>\r\n<h1>\r\n  Station(s) en attente de validation\r\n</h1>\r\n\r\n<h1>\r\n  Donnée(s) en attente de validation\r\n</h1>\r\n\r\n<!-- Modal refuse user -->\r\n<div class=\"modal fade\" id=\"refuseUserModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"refuseUserModalLabel\" aria-hidden=\"true\">\r\n  <app-refuse-user-modal [currUser]=currUser (sent)=\"loadAwaitingUsers($event)\"></app-refuse-user-modal>\r\n</div>"

        /***/
      }),

    /***/
    "./src/app/_components/admin-panel/admin-panel.component.ts":
      /*!******************************************************************!*\
        !*** ./src/app/_components/admin-panel/admin-panel.component.ts ***!
        \******************************************************************/
      /*! exports provided: AdminPanelComponent */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "AdminPanelComponent", function() { return AdminPanelComponent; });
        /* harmony import */
        var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
        /* harmony import */
        var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
        /* harmony import */
        var _services_user_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! ../../_services/user.service */ "./src/app/_services/user.service.ts");
        /* harmony import */
        var _services_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__( /*! ../../_services/index */ "./src/app/_services/index.ts");
        var __decorate = (undefined && undefined.__decorate) || function(decorators, target, key, desc) {
          var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
          if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
          else
            for (var i = decorators.length - 1; i >= 0; i--)
              if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
          return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
        var __metadata = (undefined && undefined.__metadata) || function(k, v) {
          if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
        };




        var AdminPanelComponent = /** @class */ (function() {
          function AdminPanelComponent(userService, alertService) {
            this.userService = userService;
            this.alertService = alertService;
            this.users = [];
            this.headers = ["Nom", "Prénom", "Adresse mail", "Date de création"];
          }
          AdminPanelComponent.prototype.ngOnInit = function() {
            this.loadAwaitingUsers();
          };
          AdminPanelComponent.prototype.loadAwaitingUsers = function() {
            var self = this;
            this.userService.getAllAwaiting()
              .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["first"])())
              .subscribe(function(res) {
                for (var _i = 0, res_1 = res; _i < res_1.length; _i++) {
                  var usr = res_1[_i];
                  usr.niceDate = self.toNiceDate(new Date(usr.created_at));
                }
                self.users = res;
              });
          };
          AdminPanelComponent.prototype.loadAwaitingStation = function() {};
          AdminPanelComponent.prototype.loadAwaitingData = function() {};
          AdminPanelComponent.prototype.setCurrUser = function(id) {
            this.currUser = id;
          };
          AdminPanelComponent.prototype.acceptUser = function(id) {
            var self = this;
            this.userService.acceptUser(id)
              .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["first"])())
              .subscribe(function(result) {
                self.loadAwaitingUsers();
                self.alertService.success("L'utilisateur a été ajouté avec succès");
              }, function(error) {
                self.alertService.error(error);
              });
          };
          AdminPanelComponent.prototype.toNiceDate = function(date) {
            return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() + " à " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
          };
          AdminPanelComponent = __decorate([
            Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
              selector: 'app-admin-panel',
              template: __webpack_require__( /*! ./admin-panel.component.html */ "./src/app/_components/admin-panel/admin-panel.component.html"),
              styles: [__webpack_require__( /*! ./admin-panel.component.css */ "./src/app/_components/admin-panel/admin-panel.component.css")]
            }),
            __metadata("design:paramtypes", [_services_user_service__WEBPACK_IMPORTED_MODULE_2__["UserService"], _services_index__WEBPACK_IMPORTED_MODULE_3__["AlertService"]])
          ], AdminPanelComponent);
          return AdminPanelComponent;
        }());



        /***/
      }),

    /***/
    "./src/app/_components/admin-panel/refuse-user-modal/refuse-user-modal.component.css":
      /*!*******************************************************************************************!*\
        !*** ./src/app/_components/admin-panel/refuse-user-modal/refuse-user-modal.component.css ***!
        \*******************************************************************************************/
      /*! no static exports found */
      /***/
      (function(module, exports) {

        module.exports = ".ng-valid[required], .ng-valid.required {\r\n  border-left: 5px solid #42A948;\r\n  /* green */\r\n}\r\n\r\n.ng-invalid:not(form) {\r\n  border-left: 5px solid #a94442;\r\n  /* red */\r\n}\r\n\r\nbutton:hover {\r\n  background-color: #cfd8dc;\r\n}\r\n\r\nbutton:disabled {\r\n  background-color: #eee;\r\n  color: #aaa;\r\n  cursor: auto;\r\n}\r\n\r\n.btn[disabled], fieldset[disabled] .btn {\r\n  cursor: not-allowed;\r\n  filter: alpha(opacity=65);\r\n  box-shadow: none;\r\n  opacity: .65;\r\n}\r\n\r\n.modal-lg {\r\n  max-width: 75%;\r\n}"

        /***/
      }),

    /***/
    "./src/app/_components/admin-panel/refuse-user-modal/refuse-user-modal.component.html":
      /*!********************************************************************************************!*\
        !*** ./src/app/_components/admin-panel/refuse-user-modal/refuse-user-modal.component.html ***!
        \********************************************************************************************/
      /*! no static exports found */
      /***/
      (function(module, exports) {

        module.exports = "<div class=\"modal-dialog modal-dialog-centered modal-lg\" role=\"document\">\r\n  <div class=\"modal-content\">\r\n    <!-- Header -->\r\n    <div class=\"modal-header\">\r\n      <h1 class=\"modal-title\" id=\"refuseUserModalLabel\">Refuser un utilisateur</h1>\r\n      <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\r\n        <span aria-hidden=\"true\">&times;</span>\r\n      </button>\r\n    </div>\r\n\r\n    <!-- Body -->\r\n    <div class=\"modal-body\">\r\n      <div class=\"container\">\r\n        <form [formGroup]=\"sendFeedbackForm\" #sendFeedbackFormNg=\"ngForm\">\r\n          <div class=\"form-group\">\r\n            <textarea rows=\"6\" class=\"form-control\" id=\"note\" formControlName=\"note\" placeholder=\"Entrez ici la raison du refus ...\"></textarea>\r\n          </div>\r\n          <p> Un mail sera envoyé à l'utilisateur concerné contenant la raison de son refus.</p>\r\n        </form>\r\n      </div>\r\n    </div>\r\n\r\n    <!-- Footer -->\r\n    <div class=\"modal-footer\">\r\n      <button type=\"button\" (click)=\"resetInterface()\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Annuler\r\n      </button>\r\n      <button (click)=\"refuseUser()\" type=\"submit\" class=\"btn btn-success\" data-dismiss=\"modal\"> Envoyer\r\n      </button>\r\n    </div>\r\n\r\n  </div>\r\n</div>"

        /***/
      }),

    /***/
    "./src/app/_components/admin-panel/refuse-user-modal/refuse-user-modal.component.ts":
      /*!******************************************************************************************!*\
        !*** ./src/app/_components/admin-panel/refuse-user-modal/refuse-user-modal.component.ts ***!
        \******************************************************************************************/
      /*! exports provided: RefuseUserModalComponent */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "RefuseUserModalComponent", function() { return RefuseUserModalComponent; });
        /* harmony import */
        var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
        /* harmony import */
        var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
        /* harmony import */
        var _services__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! ../../../_services */ "./src/app/_services/index.ts");
        /* harmony import */
        var _services_user_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__( /*! ../../../_services/user.service */ "./src/app/_services/user.service.ts");
        /* harmony import */
        var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__( /*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
        var __decorate = (undefined && undefined.__decorate) || function(decorators, target, key, desc) {
          var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
          if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
          else
            for (var i = decorators.length - 1; i >= 0; i--)
              if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
          return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
        var __metadata = (undefined && undefined.__metadata) || function(k, v) {
          if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
        };





        var RefuseUserModalComponent = /** @class */ (function() {
          function RefuseUserModalComponent(alertService, userService) {
            this.alertService = alertService;
            this.userService = userService;
            this.sent = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
          }
          RefuseUserModalComponent.prototype.ngOnInit = function() {
            this.note = "";
            var self = this;
            this.sendFeedbackForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormGroup"]({
              'note': new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormControl"](self.note)
            });
          };
          RefuseUserModalComponent.prototype.resetInterface = function() {
            this.sent.emit(true);
            this.sendFeedbackForm.reset();
          };
          RefuseUserModalComponent.prototype.refuseUser = function() {
            var _this = this;
            var self = this;
            this.userService.refuseUser(this.currUser, this.sendFeedbackForm.get("note").value)
              .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["first"])())
              .subscribe(function(result) {
                _this.sendFeedbackForm.reset();
                self.sent.emit(true);
                self.alertService.success("L'utilisateur a été refusé avec succès");
              }, function(error) {
                self.alertService.error(error);
              });
          };
          __decorate([
            Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
            __metadata("design:type", String)
          ], RefuseUserModalComponent.prototype, "currUser", void 0);
          __decorate([
            Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
            __metadata("design:type", Object)
          ], RefuseUserModalComponent.prototype, "sent", void 0);
          RefuseUserModalComponent = __decorate([
            Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
              selector: 'app-refuse-user-modal',
              template: __webpack_require__( /*! ./refuse-user-modal.component.html */ "./src/app/_components/admin-panel/refuse-user-modal/refuse-user-modal.component.html"),
              styles: [__webpack_require__( /*! ./refuse-user-modal.component.css */ "./src/app/_components/admin-panel/refuse-user-modal/refuse-user-modal.component.css")]
            }),
            __metadata("design:paramtypes", [_services__WEBPACK_IMPORTED_MODULE_2__["AlertService"],
              _services_user_service__WEBPACK_IMPORTED_MODULE_3__["UserService"]
            ])
          ], RefuseUserModalComponent);
          return RefuseUserModalComponent;
        }());



        /***/
      }),

    /***/
    "./src/app/_components/faq/faq.component.css":
      /*!***************************************************!*\
        !*** ./src/app/_components/faq/faq.component.css ***!
        \***************************************************/
      /*! no static exports found */
      /***/
      (function(module, exports) {

        module.exports = ""

        /***/
      }),

    /***/
    "./src/app/_components/faq/faq.component.html":
      /*!****************************************************!*\
        !*** ./src/app/_components/faq/faq.component.html ***!
        \****************************************************/
      /*! no static exports found */
      /***/
      (function(module, exports) {

        module.exports = "<p>\n  faq works!\n</p>\n"

        /***/
      }),

    /***/
    "./src/app/_components/faq/faq.component.ts":
      /*!**************************************************!*\
        !*** ./src/app/_components/faq/faq.component.ts ***!
        \**************************************************/
      /*! exports provided: FaqComponent */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "FaqComponent", function() { return FaqComponent; });
        /* harmony import */
        var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
        var __decorate = (undefined && undefined.__decorate) || function(decorators, target, key, desc) {
          var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
          if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
          else
            for (var i = decorators.length - 1; i >= 0; i--)
              if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
          return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
        var __metadata = (undefined && undefined.__metadata) || function(k, v) {
          if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
        };

        var FaqComponent = /** @class */ (function() {
          function FaqComponent() {}
          FaqComponent.prototype.ngOnInit = function() {};
          FaqComponent = __decorate([
            Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
              selector: 'app-faq',
              template: __webpack_require__( /*! ./faq.component.html */ "./src/app/_components/faq/faq.component.html"),
              styles: [__webpack_require__( /*! ./faq.component.css */ "./src/app/_components/faq/faq.component.css")]
            }),
            __metadata("design:paramtypes", [])
          ], FaqComponent);
          return FaqComponent;
        }());



        /***/
      }),

    /***/
    "./src/app/_components/footer/footer.component.css":
      /*!*********************************************************!*\
        !*** ./src/app/_components/footer/footer.component.css ***!
        \*********************************************************/
      /*! no static exports found */
      /***/
      (function(module, exports) {

        module.exports = ".copyright{\n  min-height: 5vh;\n}\n.footer {\n  text-align: center;\n}\n"

        /***/
      }),

    /***/
    "./src/app/_components/footer/footer.component.html":
      /*!**********************************************************!*\
        !*** ./src/app/_components/footer/footer.component.html ***!
        \**********************************************************/
      /*! no static exports found */
      /***/
      (function(module, exports) {

        module.exports = "<!-- Footer -->\r\n<!--\r\n<footer class=\"footer text-center\">\r\n  <div class=\"container\">\r\n    <div class=\"row\">\r\n      <div class=\"col-md-4 mb-5 mb-lg-0\">\r\n        <h4 class=\"text-uppercase mb-4\">Location</h4>\r\n        <p class=\"lead mb-0\">2215 John Daniel Drive\r\n          <br>Clark, MO 65243</p>\r\n      </div>\r\n      <div class=\"col-md-4 mb-5 mb-lg-0\">\r\n        <h4 class=\"text-uppercase mb-4\">Around the Web</h4>\r\n        <ul class=\"list-inline mb-0\">\r\n          <li class=\"list-inline-item\">\r\n            <a class=\"btn btn-outline-light btn-social text-center rounded-circle\" href=\"#\">\r\n              <i class=\"fab fa-fw fa-facebook-f\"></i>\r\n            </a>\r\n          </li>\r\n          <li class=\"list-inline-item\">\r\n            <a class=\"btn btn-outline-light btn-social text-center rounded-circle\" href=\"#\">\r\n              <i class=\"fab fa-fw fa-google-plus-g\"></i>\r\n            </a>\r\n          </li>\r\n          <li class=\"list-inline-item\">\r\n            <a class=\"btn btn-outline-light btn-social text-center rounded-circle\" href=\"#\">\r\n              <i class=\"fab fa-fw fa-twitter\"></i>\r\n            </a>\r\n          </li>\r\n          <li class=\"list-inline-item\">\r\n            <a class=\"btn btn-outline-light btn-social text-center rounded-circle\" href=\"#\">\r\n              <i class=\"fab fa-fw fa-linkedin-in\"></i>\r\n            </a>\r\n          </li>\r\n          <li class=\"list-inline-item\">\r\n            <a class=\"btn btn-outline-light btn-social text-center rounded-circle\" href=\"#\">\r\n              <i class=\"fab fa-fw fa-dribbble\"></i>\r\n            </a>\r\n          </li>\r\n        </ul>\r\n      </div>\r\n      <div class=\"col-md-4\">\r\n        <h4 class=\"text-uppercase mb-4\">About Freelancer</h4>\r\n        <p class=\"lead mb-0\">Freelance is a free to use, open source Bootstrap theme created by\r\n          <a href=\"http://startbootstrap.com\">Start Bootstrap</a>.</p>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</footer>\r\n-->\r\n\r\n<div class=\" footer copyright py-4 text-center text-white\">\r\n  <div class=\"container\">\r\n    <small>Copyright &copy; TFE4Haiti</small>\r\n  </div>\r\n</div>"

        /***/
      }),

    /***/
    "./src/app/_components/footer/footer.component.ts":
      /*!********************************************************!*\
        !*** ./src/app/_components/footer/footer.component.ts ***!
        \********************************************************/
      /*! exports provided: FooterComponent */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "FooterComponent", function() { return FooterComponent; });
        /* harmony import */
        var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
        var __decorate = (undefined && undefined.__decorate) || function(decorators, target, key, desc) {
          var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
          if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
          else
            for (var i = decorators.length - 1; i >= 0; i--)
              if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
          return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
        var __metadata = (undefined && undefined.__metadata) || function(k, v) {
          if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
        };

        var FooterComponent = /** @class */ (function() {
          function FooterComponent() {}
          FooterComponent.prototype.ngOnInit = function() {};
          FooterComponent = __decorate([
            Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
              selector: 'app-footer',
              template: __webpack_require__( /*! ./footer.component.html */ "./src/app/_components/footer/footer.component.html"),
              styles: [__webpack_require__( /*! ./footer.component.css */ "./src/app/_components/footer/footer.component.css")]
            }),
            __metadata("design:paramtypes", [])
          ], FooterComponent);
          return FooterComponent;
        }());



        /***/
      }),

    /***/
    "./src/app/_components/home/home.component.css":
      /*!*****************************************************!*\
        !*** ./src/app/_components/home/home.component.css ***!
        \*****************************************************/
      /*! no static exports found */
      /***/
      (function(module, exports) {

        module.exports = "#mapid{\n  height: 600px;\n  width: 100%;\n}\n\n"

        /***/
      }),

    /***/
    "./src/app/_components/home/home.component.html":
      /*!******************************************************!*\
        !*** ./src/app/_components/home/home.component.html ***!
        \******************************************************/
      /*! no static exports found */
      /***/
      (function(module, exports) {

        module.exports = "<div class=\"row\">\r\n\r\n  <div class=\"col-md-3\">\r\n    <div class=\"input-group mb-3\">\r\n      <div class=\"input-group-prepend\">\r\n        <span class=\"input-group-text\" id=\"basic-addon1\"><i class=\"fas fa-search\"></i></span>\r\n      </div>\r\n      <input type=\"text\" class=\"form-control\" placeholder=\"Recherche\" aria-label=\"Recherche\" aria-describedby=\"basic-addon1\" (keyup)=\"filterStation($event)\">\r\n    </div>\r\n    <ul class=\"list-group\">\r\n      <li class=\"list-group-item\"\r\n          *ngFor=\"let station of filteredStation\"\r\n          [ngClass]=\"{\r\n          'list-group-item':true,\r\n          'list-group-item-primary': getSelectedClass(station)\r\n          }\"\r\n          (click)=\"toogleSelectionFor(station)\"\r\n      >\r\n        {{station.name}}\r\n      </li>\r\n\r\n\r\n\r\n    </ul>\r\n  </div>\r\n  <div class=\"col-md-8 offset-md-1\">\r\n    <div id=\"mapid\">\r\n\r\n    </div>\r\n  </div>\r\n</div>\r\n"

        /***/
      }),

    /***/
    "./src/app/_components/home/home.component.ts":
      /*!****************************************************!*\
        !*** ./src/app/_components/home/home.component.ts ***!
        \****************************************************/
      /*! exports provided: HomeComponent */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "HomeComponent", function() { return HomeComponent; });
        /* harmony import */
        var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
        /* harmony import */
        var leaflet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! leaflet */ "./node_modules/leaflet/dist/leaflet-src.js");
        /* harmony import */
        var leaflet__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(leaflet__WEBPACK_IMPORTED_MODULE_1__);
        /* harmony import */
        var _services_stations_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! ../../_services/stations.service */ "./src/app/_services/stations.service.ts");
        var __decorate = (undefined && undefined.__decorate) || function(decorators, target, key, desc) {
          var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
          if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
          else
            for (var i = decorators.length - 1; i >= 0; i--)
              if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
          return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
        var __metadata = (undefined && undefined.__metadata) || function(k, v) {
          if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
        };



        var HomeComponent = /** @class */ (function() {
          function HomeComponent(stationsService) {
            this.stationsService = stationsService;
            this.allStations = [];
            this.selectedStation = [];
            this.filteredStation = [];
            this.zoom = 8;
            this.centerMap = [19.099041, -72.658473];
          }
          HomeComponent.prototype.ngOnInit = function() {
            var self = this;
            this.stationsService.getAll().subscribe(function(result) {
              self.selectedStation = result.slice(0); //make a clone
              self.allStations = result.slice(0);
              self.filteredStation = result.slice(0);
              self.generateMap();
            });
          };
          HomeComponent.prototype.generateMap = function() {
            var self = this;
            if (self.mapContainer) {
              self.mapContainer.off();
              self.mapContainer.remove();
            }
            var icon = {
              working: leaflet__WEBPACK_IMPORTED_MODULE_1__["icon"]({
                iconUrl: 'assets/img/marker-working.png',
                iconSize: [20, 35],
                iconAnchor: [11, 34],
                popupAnchor: [-3, -38] // point from which the popup should open relative to the iconAnchor
              }),
              awaiting: leaflet__WEBPACK_IMPORTED_MODULE_1__["icon"]({
                iconUrl: 'assets/img/marker-wait.png',
                iconSize: [20, 35],
                iconAnchor: [11, 34],
                popupAnchor: [-3, -38] // point from which the popup should open relative to the iconAnchor
              }),
              broken: leaflet__WEBPACK_IMPORTED_MODULE_1__["icon"]({
                iconUrl: 'assets/img/marker-broken.png',
                iconSize: [20, 35],
                iconAnchor: [11, 34],
                popupAnchor: [-3, -38] // point from which the popup should open relative to the iconAnchor
              }),
              deleted: leaflet__WEBPACK_IMPORTED_MODULE_1__["icon"]({
                iconUrl: 'assets/img/marker-delete.png',
                iconSize: [20, 35],
                iconAnchor: [11, 34],
                popupAnchor: [-3, -38] // point from which the popup should open relative to the iconAnchor
              })
            };
            var stationGroup = {
              working: leaflet__WEBPACK_IMPORTED_MODULE_1__["layerGroup"](),
              awaiting: leaflet__WEBPACK_IMPORTED_MODULE_1__["layerGroup"](),
              broken: leaflet__WEBPACK_IMPORTED_MODULE_1__["layerGroup"](),
              deleted: leaflet__WEBPACK_IMPORTED_MODULE_1__["layerGroup"]()
            };
            self.selectedStation.forEach(function(station) {
              leaflet__WEBPACK_IMPORTED_MODULE_1__["marker"]([station.latitude, station.longitude], { icon: icon[station.state] }).bindPopup("<b>" + station.name + " </b><br/>").addTo(stationGroup[station.state]);
            });
            console.table(self.selectedStation);
            var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
              '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
              'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
            // Maps usage : OpenStreetMap, OpenSurferMaps
            var mapLayerOSMGrayScale = leaflet__WEBPACK_IMPORTED_MODULE_1__["tileLayer"]('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
                id: 'mapbox.light',
                attribution: mbAttr
              }),
              mapLayerOSMTopo = leaflet__WEBPACK_IMPORTED_MODULE_1__["tileLayer"]('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                id: 'mapbox.streets',
                attribution: mbAttr
              }),
              mapLayerOpenStreetMap = leaflet__WEBPACK_IMPORTED_MODULE_1__["tileLayer"]('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
              }),
              mapLayerErsiWorlStreetMap = leaflet__WEBPACK_IMPORTED_MODULE_1__["tileLayer"]('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
              }),
              mapLayerErsiSatelite = leaflet__WEBPACK_IMPORTED_MODULE_1__["tileLayer"]('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              }),
              mapLayerHyddaFull = leaflet__WEBPACK_IMPORTED_MODULE_1__["tileLayer"]('https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              });
            self.mapContainer = leaflet__WEBPACK_IMPORTED_MODULE_1__["map"]('mapid', {
              center: [self.centerMap[0], self.centerMap[1]],
              zoom: self.zoom,
              minZoom: 8,
              maxZoom: 18,
              layers: [mapLayerOSMGrayScale, stationGroup.working, stationGroup.deleted, stationGroup.awaiting, stationGroup.broken]
            });
            leaflet__WEBPACK_IMPORTED_MODULE_1__["control"].scale().addTo(self.mapContainer);
            var legend = leaflet__WEBPACK_IMPORTED_MODULE_1__["control"].attribution({ position: 'bottomright' });
            legend.onAdd = function(map) {
              var div = leaflet__WEBPACK_IMPORTED_MODULE_1__["DomUtil"].create('div', 'info legend'),
                grades = ['OK', 'En panne', 'Supprimée', 'A valider'],
                color = ['#5cd65c', '#ffb84d', '#ff471a', '#1aa3ff'];
              // loop through our density intervals and generate a label with a colored square for each interval
              for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                  '<i style="background:' + color[i] + '"></i> ' +
                  grades[i] + '<br>';
              }
              return div;
            };
            legend.addTo(self.mapContainer);
            var baseLayers = {
              'OpenStreetMap': mapLayerOpenStreetMap,
              'OSM - Opentopomap': mapLayerOSMTopo,
              'OSM - Grayscale': mapLayerOSMGrayScale,
              'Ersi WorldStreetMap': mapLayerErsiWorlStreetMap,
              'Ersi - Satelite': mapLayerErsiSatelite,
              'Hydda - Full': mapLayerHyddaFull
            };
            var overlays = {
              'Fonctionnelle': stationGroup.working,
              'En panne': stationGroup.broken,
              'A valider': stationGroup.awaiting,
              'Supprimee': stationGroup.deleted
            };
            leaflet__WEBPACK_IMPORTED_MODULE_1__["control"].layers(baseLayers, overlays).addTo(self.mapContainer);
            self.mapContainer.on('zoomend', function(e) {
              self.zoom = e.target._animateToZoom;
            });
            self.mapContainer.on('moveend', function(e) {
              var center = self.mapContainer.getBounds().getCenter();
              self.centerMap = [center.lat, center.lng];
            });
            self.mapContainer.on('baselayerchange', function(e) {
              console.log('maps layer change', e.layer);
            });
          };
          HomeComponent.prototype.getSelectedClass = function(station) {
            if (this.selectedStation.length == this.allStations.length) {
              return false;
            }
            return this.selectedStation.indexOf(station) >= 0;
          };
          HomeComponent.prototype.toogleSelectionFor = function(station) {
            var self = this;
            if (self.selectedStation.length == self.allStations.length) {
              self.selectedStation = [];
            }
            var index = self.selectedStation.indexOf(station);
            if (index == -1) {
              self.selectedStation.push(station);
              self.centerMap = [station.latitude, station.longitude];
              self.zoom = 12;
            } else {
              self.selectedStation.splice(index, 1);
            }
            self.generateMap();
          };
          HomeComponent.prototype.filterStation = function(event) {
            var term = event.target.value;
            console.log(term);
            this.filteredStation = this.allStations.filter(function(value) {
              // return value.name.toLowerCase().startsWith(term.toLowerCase());
              return value.name.toLowerCase().includes(term.toLowerCase());
            });
            // console.table(this.filteredStation)
          };
          HomeComponent = __decorate([
            Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
              selector: 'app-home',
              template: __webpack_require__( /*! ./home.component.html */ "./src/app/_components/home/home.component.html"),
              styles: [__webpack_require__( /*! ./home.component.css */ "./src/app/_components/home/home.component.css")]
            }),
            __metadata("design:paramtypes", [_services_stations_service__WEBPACK_IMPORTED_MODULE_2__["StationsService"]])
          ], HomeComponent);
          return HomeComponent;
        }());



        /***/
      }),

    /***/
    "./src/app/_components/login/askreset/askreset.component.css":
      /*!*******************************************************************!*\
        !*** ./src/app/_components/login/askreset/askreset.component.css ***!
        \*******************************************************************/
      /*! no static exports found */
      /***/
      (function(module, exports) {

        module.exports = ""

        /***/
      }),

    /***/
    "./src/app/_components/login/askreset/askreset.component.html":
      /*!********************************************************************!*\
        !*** ./src/app/_components/login/askreset/askreset.component.html ***!
        \********************************************************************/
      /*! no static exports found */
      /***/
      (function(module, exports) {

        module.exports = "<p>\n  askreset works!\n</p>\n"

        /***/
      }),

    /***/
    "./src/app/_components/login/askreset/askreset.component.ts":
      /*!******************************************************************!*\
        !*** ./src/app/_components/login/askreset/askreset.component.ts ***!
        \******************************************************************/
      /*! exports provided: AskresetComponent */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "AskresetComponent", function() { return AskresetComponent; });
        /* harmony import */
        var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
        var __decorate = (undefined && undefined.__decorate) || function(decorators, target, key, desc) {
          var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
          if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
          else
            for (var i = decorators.length - 1; i >= 0; i--)
              if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
          return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
        var __metadata = (undefined && undefined.__metadata) || function(k, v) {
          if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
        };

        var AskresetComponent = /** @class */ (function() {
          function AskresetComponent() {}
          AskresetComponent.prototype.ngOnInit = function() {};
          AskresetComponent = __decorate([
            Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
              selector: 'app-askreset',
              template: __webpack_require__( /*! ./askreset.component.html */ "./src/app/_components/login/askreset/askreset.component.html"),
              styles: [__webpack_require__( /*! ./askreset.component.css */ "./src/app/_components/login/askreset/askreset.component.css")]
            }),
            __metadata("design:paramtypes", [])
          ], AskresetComponent);
          return AskresetComponent;
        }());



        /***/
      }),

    /***/
    "./src/app/_components/login/index.ts":
      /*!********************************************!*\
        !*** ./src/app/_components/login/index.ts ***!
        \********************************************/
      /*! exports provided: LoginComponent */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony import */
        var _login_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ./login.component */ "./src/app/_components/login/login.component.ts");
        /* harmony reexport (safe) */
        __webpack_require__.d(__webpack_exports__, "LoginComponent", function() { return _login_component__WEBPACK_IMPORTED_MODULE_0__["LoginComponent"]; });




        /***/
      }),

    /***/
    "./src/app/_components/login/login.component.css":
      /*!*******************************************************!*\
        !*** ./src/app/_components/login/login.component.css ***!
        \*******************************************************/
      /*! no static exports found */
      /***/
      (function(module, exports) {

        module.exports = "h2 {\r\n  color: #111;\r\n  font-family: 'Open Sans', sans-serif;\r\n  font-size: 30px;\r\n  font-weight: 300;\r\n  line-height: 32px;\r\n  margin: 0 0 40px;\r\n  text-align: center;\r\n}\r\n\r\nbutton {\r\n  width: 100%;\r\n}\r\n\r\n.someSpace {\r\n  padding-bottom: 10px;\r\n  text-align: center;\r\n}"

        /***/
      }),

    /***/
    "./src/app/_components/login/login.component.html":
      /*!********************************************************!*\
        !*** ./src/app/_components/login/login.component.html ***!
        \********************************************************/
      /*! no static exports found */
      /***/
      (function(module, exports) {

        module.exports = "<div class=\"row\">\r\n  <div class=\"col-md-4 offset-md-1\">\r\n    <h2>Login</h2>\r\n    <form [formGroup]=\"loginForm\" (ngSubmit)=\"onLogin()\">\r\n      <div class=\"form-group\">\r\n        <input type=\"text\" placeholder=\"Adresse mail\" formControlName=\"username\" class=\"form-control\" [ngClass]=\"{ 'is-invalid': loginSubmitted && f.username.errors }\" />\r\n        <div *ngIf=\"loginSubmitted && f.username.errors\" class=\"invalid-feedback\">\r\n          <div *ngIf=\"f.username.errors.required\">Adresse mail requise</div>\r\n        </div>\r\n      </div>\r\n      <div class=\"form-group\">\r\n        <input type=\"password\" placeholder=\"Mot de passe\" formControlName=\"password\" class=\"form-control\" [ngClass]=\"{ 'is-invalid': loginSubmitted && f.password.errors }\" />\r\n        <div *ngIf=\"loginSubmitted && f.password.errors\" class=\"invalid-feedback\">\r\n          <div *ngIf=\"f.password.errors.required\">Mot de passe requis</div>\r\n        </div>\r\n      </div>\r\n      <div class=\"someSpace\">\r\n        <a [routerLink]=\"['/login/askreset']\">Mot de passe oublié ?</a>\r\n      </div>\r\n      <div class=\"form-group\">\r\n        <button [disabled]=\"loading\" class=\"btn btn-primary\">Login</button>\r\n        <img *ngIf=\"loading\" src=\"data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==\" />\r\n      </div>\r\n    </form>\r\n  </div>\r\n\r\n  <div class=\"col-md-4 offset-md-2\">\r\n    <h2>Demande de compte</h2>\r\n    <form [formGroup]=\"registerForm\" (ngSubmit)=\"onRegister()\">\r\n      <div class=\"form-group\">\r\n        <input type=\"text\" placeholder=\"Adresse mail\" formControlName=\"username\" class=\"form-control\" [ngClass]=\"{ 'is-invalid': registerSubmitted && r.username.errors }\" />\r\n        <div *ngIf=\"registerSubmitted && r.username.errors\" class=\"invalid-feedback\">\r\n          <div *ngIf=\"r.username.errors.required\">Adresse mail requise</div>\r\n        </div>\r\n      </div>\r\n      <div class=\"form-group\">\r\n        <input type=\"text\" placeholder=\"Prénom\" formControlName=\"first_name\" class=\"form-control\" [ngClass]=\"{ 'is-invalid': registerSubmitted && r.first_name.errors }\" />\r\n        <div *ngIf=\"registerSubmitted && r.first_name.errors\" class=\"invalid-feedback\">\r\n          <div *ngIf=\"r.first_name.errors.required\">Prénom requis</div>\r\n        </div>\r\n      </div>\r\n      <div class=\"form-group\">\r\n        <input type=\"text\" placeholder=\"Nom\" formControlName=\"last_name\" class=\"form-control\" [ngClass]=\"{ 'is-invalid': registerSubmitted && r.last_name.errors }\" />\r\n        <div *ngIf=\"registerSubmitted && r.last_name.errors\" class=\"invalid-feedback\">\r\n          <div *ngIf=\"r.last_name.errors.required\">Nom requis</div>\r\n        </div>\r\n      </div>\r\n      <div class=\"form-group\">\r\n        <input type=\"password\" placeholder=\"Mot de passe (JE DOIS DISPARAITRE A TERME)\" formControlName=\"password\" class=\"form-control\" [ngClass]=\"{ 'is-invalid': registerSubmitted && r.password.errors }\" />\r\n        <div *ngIf=\"registerSubmitted && r.password.errors\" class=\"invalid-feedback\">\r\n          <div *ngIf=\"r.password.errors.required\">Mot de passe requis</div>\r\n        </div>\r\n      </div>\r\n      <div class=\"form-group\">\r\n        <button [disabled]=\"loading\" class=\"btn btn-primary\">Inscription</button>\r\n        <img *ngIf=\"loading\" src=\"data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==\" />\r\n\r\n      </div>\r\n    </form>\r\n  </div>\r\n</div>\r\n"

        /***/
      }),

    /***/
    "./src/app/_components/login/login.component.ts":
      /*!******************************************************!*\
        !*** ./src/app/_components/login/login.component.ts ***!
        \******************************************************/
      /*! exports provided: LoginComponent */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "LoginComponent", function() { return LoginComponent; });
        /* harmony import */
        var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
        /* harmony import */
        var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
        /* harmony import */
        var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
        /* harmony import */
        var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__( /*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
        /* harmony import */
        var _services_index__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__( /*! ../../_services/index */ "./src/app/_services/index.ts");
        /* harmony import */
        var _services_localstorage_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__( /*! ../../_services/localstorage.service */ "./src/app/_services/localstorage.service.ts");
        var __decorate = (undefined && undefined.__decorate) || function(decorators, target, key, desc) {
          var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
          if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
          else
            for (var i = decorators.length - 1; i >= 0; i--)
              if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
          return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
        var __metadata = (undefined && undefined.__metadata) || function(k, v) {
          if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
        };






        var LoginComponent = /** @class */ (function() {
          function LoginComponent(formBuilder, route, router, authenticationService, alertService, localStorageService) {
            this.formBuilder = formBuilder;
            this.route = route;
            this.router = router;
            this.authenticationService = authenticationService;
            this.alertService = alertService;
            this.localStorageService = localStorageService;
            this.loading = false;
            this.loginSubmitted = false;
            this.registerSubmitted = false;
          }
          LoginComponent.prototype.ngOnInit = function() {
            this.loginForm = this.formBuilder.group({
              username: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
              password: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]
            });
            this.registerForm = this.formBuilder.group({
              username: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
              password: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
              first_name: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
              last_name: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]
            });
            // get return url from route parameters or default to '/'
            this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          };
          Object.defineProperty(LoginComponent.prototype, "f", {
            // convenience getter for easy access to form fields
            get: function() {
              return this.loginForm.controls;
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(LoginComponent.prototype, "r", {
            get: function() {
              return this.registerForm.controls;
            },
            enumerable: true,
            configurable: true
          });
          LoginComponent.prototype.onLogin = function() {
            var _this = this;
            this.loginSubmitted = true;
            var self = this;
            // stop here if form is invalid
            if (this.loginForm.invalid) {
              return;
            }
            this.loading = true;
            this.authenticationService.login(this.f.username.value, this.f.password.value)
              .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["first"])())
              .subscribe(function(data) {
                self.router.navigate([_this.returnUrl]);
                self.loading = false;
              }, function(error) {
                self.alertService.error(error);
                self.loading = false;
              });
          };
          LoginComponent.prototype.onRegister = function() {
            var _this = this;
            this.registerSubmitted = true;
            // stop here if form is invalid
            if (this.registerForm.invalid) {
              return;
            }
            this.loading = true;
            var self = this;
            this.authenticationService.register(this.r.first_name.value, this.r.last_name.value, this.r.username.value, this.r.password.value)
              .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["first"])())
              .subscribe(function(data) {
                _this.router.navigate(["/login"]);
                _this.alertService.success("Votre compte a été créé !\nVeuillez attendre la validation par l'administrateur.");
                _this.loading = false;
              }, function(error) {
                _this.alertService.error(error);
                _this.loading = false;
              });
          };
          LoginComponent = __decorate([
            Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
              template: __webpack_require__( /*! ./login.component.html */ "./src/app/_components/login/login.component.html"),
              styles: [__webpack_require__( /*! ./login.component.css */ "./src/app/_components/login/login.component.css")]
            }),
            __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"],
              _angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"],
              _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"],
              _services_index__WEBPACK_IMPORTED_MODULE_4__["AuthenticationService"],
              _services_index__WEBPACK_IMPORTED_MODULE_4__["AlertService"],
              _services_localstorage_service__WEBPACK_IMPORTED_MODULE_5__["LocalstorageService"]
            ])
          ], LoginComponent);
          return LoginComponent;
        }());



        /***/
      }),

    /***/
    "./src/app/_components/login/reset-password/reset-password.component.html":
      /*!********************************************************************************!*\
        !*** ./src/app/_components/login/reset-password/reset-password.component.html ***!
        \********************************************************************************/
      /*! no static exports found */
      /***/
      (function(module, exports) {

        module.exports = "<div class=\"row\">\r\n  <div class=\"col-md-4 offset-md-4\">\r\n    <h2 *ngIf=\"tata\">Changer de mot de passe</h2>\r\n    <h2 *ngIf=\"!tata\">Créer un mot de passe</h2>\r\n    <h2></h2>\r\n    <form [formGroup]=\"pwdForm\" (ngSubmit)=\"sendPwd()\">\r\n      <div class=\"form-group\">\r\n        <input type=\"password\" placeholder=\"Mot de passe\" formControlName=\"pwd\" class=\"form-control\" [ngClass]=\"{ 'is-invalid': pwdSubmited && r.pwd.errors }\" />\r\n        <div *ngIf=\"pwdSubmited && r.pwd.errors\" class=\"invalid-feedback\">\r\n          <div *ngIf=\"r.pwd.errors.required\">Mot de passe requise</div>\r\n        </div>\r\n      </div>\r\n      <div class=\"form-group\">\r\n        <input type=\"password\" placeholder=\"Confirmation du mot de passe\" formControlName=\"pwdConf\" class=\"form-control\" [ngClass]=\"{ 'is-invalid': pwdSubmited && r.pwdConf.errors }\" />\r\n        <div *ngIf=\"pwdSubmited && r.pwdConf.errors\" class=\"invalid-feedback\">\r\n          <div *ngIf=\"r.pwdConf.errors.required\">Confirmation requise</div>\r\n        </div>\r\n      </div>\r\n      <div *ngIf=\"pwdNotMatch\" class=\"alert alert-danger\">\r\n        Les mots de passe ne correspondent pas.\r\n      </div>\r\n      <div class=\"form-group\">\r\n        <button [disabled]=\"loading\" class=\"btn btn-primary\">Envoyer</button>\r\n        <img *ngIf=\"loading\" src=\"data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==\" />\r\n      </div>\r\n    </form>\r\n  </div>\r\n\r\n</div>"

        /***/
      }),

    /***/
    "./src/app/_components/login/reset-password/reset-password.component.ts":
      /*!******************************************************************************!*\
        !*** ./src/app/_components/login/reset-password/reset-password.component.ts ***!
        \******************************************************************************/
      /*! exports provided: ResetPasswordComponent */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "ResetPasswordComponent", function() { return ResetPasswordComponent; });
        /* harmony import */
        var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
        /* harmony import */
        var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
        /* harmony import */
        var _services__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! ../../../_services */ "./src/app/_services/index.ts");
        /* harmony import */
        var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__( /*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
        var __decorate = (undefined && undefined.__decorate) || function(decorators, target, key, desc) {
          var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
          if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
          else
            for (var i = decorators.length - 1; i >= 0; i--)
              if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
          return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
        var __metadata = (undefined && undefined.__metadata) || function(k, v) {
          if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
        };




        var ResetPasswordComponent = /** @class */ (function() {
          function ResetPasswordComponent(formBuilder, authenticationService, alertService) {
            this.formBuilder = formBuilder;
            this.authenticationService = authenticationService;
            this.alertService = alertService;
            this.pwdSubmited = false;
            this.pwdNotMatch = false;
          }
          ResetPasswordComponent.prototype.ngOnInit = function() {
            this.pwdForm = this.formBuilder.group({
              pwd: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
              pwdConf: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            });
          };
          Object.defineProperty(ResetPasswordComponent.prototype, "r", {
            get: function() {
              return this.pwdForm.controls;
            },
            enumerable: true,
            configurable: true
          });
          ResetPasswordComponent.prototype.sendPwd = function() {
            var _this = this;
            this.pwdSubmited = true;
            // stop here if form is invalid
            if (this.pwdForm.invalid) {
              return;
            }
            // Check que les mots de passe correspondent
            if (this.r.pwd.value != this.r.pwdConf.value) {
              this.pwdNotMatch = true;
              //this.alertService.error("Les mot de passe ne correspondent pas");
              return;
            }
            //todo create methode in the _services/authenticationservice
            this.authenticationService.resetPwd(this.r.pwd.value, this.r.pwdConf.value)
              .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["first"])())
              .subscribe(function(data) {}, function(error) {
                _this.alertService.error(error);
              });
          };
          ResetPasswordComponent = __decorate([
            Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
              selector: 'app-reset-password',
              template: __webpack_require__( /*! ./reset-password.component.html */ "./src/app/_components/login/reset-password/reset-password.component.html"),
              styles: [__webpack_require__( /*! ./../login.component.css */ "./src/app/_components/login/login.component.css")]
            }),
            __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
              _services__WEBPACK_IMPORTED_MODULE_2__["AuthenticationService"],
              _services__WEBPACK_IMPORTED_MODULE_2__["AlertService"]
            ])
          ], ResetPasswordComponent);
          return ResetPasswordComponent;
        }());



        /***/
      }),

    /***/
    "./src/app/_components/menu/menu.component.css":
      /*!*****************************************************!*\
        !*** ./src/app/_components/menu/menu.component.css ***!
        \*****************************************************/
      /*! no static exports found */
      /***/
      (function(module, exports) {

        module.exports = ".navbar {\r\n  height:50px;\r\n  font-size: 1.2em;\r\n}\r\n.bigger{\r\n  font-size: 1.6em;\r\n}\r\n"

        /***/
      }),

    /***/
    "./src/app/_components/menu/menu.component.html":
      /*!******************************************************!*\
        !*** ./src/app/_components/menu/menu.component.html ***!
        \******************************************************/
      /*! no static exports found */
      /***/
      (function(module, exports) {

        module.exports = "<!-- Navigation -->\r\n<nav class=\"navbar navbar-expand-lg navbar-dark bg-dark fixed-top\">\r\n  <a class=\"navbar-brand bigger\" [routerLink]=\"['/']\">Accueil</a>\r\n  <button class=\"navbar-toggler\" type=\"button\" data-toggle=\"collapse\" data-target=\"#navbarNavDropdown\" aria-controls=\"navbarNavDropdown\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">\r\n    <span class=\"navbar-toggler-icon\"></span>\r\n  </button>\r\n  <div id=\"navbarNavDropdown\" class=\"navbar-collapse collapse\">\r\n    <ul class=\"navbar-nav mr-auto\">\r\n      <li class=\"nav-item\" *ngFor=\"let menuItem of menu.left \">\r\n        <a class=\"nav-link\" (click)=\"itemClick(menuItem.path)\">{{menuItem.name}}</a>\r\n      </li>\r\n\r\n    </ul>\r\n\r\n    <ul class=\" navbar-nav\">\r\n      <li class=\"nav-item\" *ngFor=\"let menuItem of menu.right \">\r\n        <a class=\"nav-link\" (click)=\"itemClick(menuItem.path)\">{{menuItem.name}}</a>\r\n      </li>\r\n      <li class=\" nav-item\">\r\n        <a class=\"nav-link\" [routerLink]=\"['faq']\"><i class=\"far fa-question-circle\"></i></a>\r\n      </li>\r\n    </ul>\r\n  </div>\r\n</nav>\r\n"

        /***/
      }),

    /***/
    "./src/app/_components/menu/menu.component.ts":
      /*!****************************************************!*\
        !*** ./src/app/_components/menu/menu.component.ts ***!
        \****************************************************/
      /*! exports provided: MenuComponent */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "MenuComponent", function() { return MenuComponent; });
        /* harmony import */
        var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
        /* harmony import */
        var _services_menu_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ../../_services/menu.service */ "./src/app/_services/menu.service.ts");
        /* harmony import */
        var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
        /* harmony import */
        var _services_localstorage_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__( /*! ../../_services/localstorage.service */ "./src/app/_services/localstorage.service.ts");
        /* harmony import */
        var _services__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__( /*! ../../_services */ "./src/app/_services/index.ts");
        var __decorate = (undefined && undefined.__decorate) || function(decorators, target, key, desc) {
          var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
          if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
          else
            for (var i = decorators.length - 1; i >= 0; i--)
              if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
          return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
        var __metadata = (undefined && undefined.__metadata) || function(k, v) {
          if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
        };





        var MenuComponent = /** @class */ (function() {
          function MenuComponent(menuService, router, localStorageService, authenticationService) {
            this.menuService = menuService;
            this.router = router;
            this.localStorageService = localStorageService;
            this.authenticationService = authenticationService;
            this.menu = { right: [], left: [] };
          }
          MenuComponent.prototype.ngOnInit = function() {
            this.menu.left = this.menuService.getMenuLeft();
            this.menu.right = this.menuService.getMenuRight();
            var self = this;
            this.localStorageService.storage$.subscribe(function(storage) {
              self.updateMenu(storage);
            });
            this.updateMenu(this.localStorageService.getStorage());
            /*this.authenticationService.isLogged().subscribe(
              value => {
                console.log('val : ', value);
              },
              err => {
                console.log('err', err);
              });*/
          };
          MenuComponent.prototype.updateMenu = function(storage) {
            var User = storage.currentUser;
            if (User && User.current) {
              var removelogin = true;
              var role = User.current.role;
              // console.log('role : ', role);
              switch (role) {
                case 'admin':
                  this.menu.left = this.menuService.getLeftAdminMenu();
                  this.menu.right = this.menuService.getRightAdminMenu();
                  break;
                case 'worker':
                  this.menu.left = this.menuService.getleftWorkerMenu();
                  this.menu.right = this.menuService.getRightWorkerMenu();
                  break;
                case 'viewer':
                  this.menu.left = this.menuService.getLeftViewerMenu();
                  this.menu.right = this.menuService.getRightViewerMenu();
                  break;
                default:
                  removelogin = false;
                  this.menu.left = this.menuService.getMenuLeft();
                  this.menu.right = this.menuService.getMenuRight();
              }
              if (removelogin) {
                // Ne pas déplacer le login a une autre place que la premiere,
                // La recherche de l'objet contenant le login ne fonctionne pas pour une raison que j'ignore.
                this.menu.right.splice(0, 1);
              }
              this.menu.right = this.menu.right.reverse();
            } else {
              this.menu.left = this.menuService.getMenuLeft();
              this.menu.right = this.menuService.getMenuRight();
            }
            // console.log('menuleft = ', this.menu.left);
            // console.log('menuRight = ', this.menu.right);
          };
          MenuComponent.prototype.itemClick = function(path) {
            if (path === 'logout') {
              this.authenticationService.logout();
            }
            this.router.navigate([path]);
          };
          MenuComponent = __decorate([
            Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
              selector: 'app-menu',
              template: __webpack_require__( /*! ./menu.component.html */ "./src/app/_components/menu/menu.component.html"),
              styles: [__webpack_require__( /*! ./menu.component.css */ "./src/app/_components/menu/menu.component.css")]
            }),
            __metadata("design:paramtypes", [_services_menu_service__WEBPACK_IMPORTED_MODULE_1__["MenuService"],
              _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
              _services_localstorage_service__WEBPACK_IMPORTED_MODULE_3__["LocalstorageService"],
              _services__WEBPACK_IMPORTED_MODULE_4__["AuthenticationService"]
            ])
          ], MenuComponent);
          return MenuComponent;
        }());



        /***/
      }),

    /***/
    "./src/app/_components/stations/add-station-modal/add-station-modal.component.css":
      /*!****************************************************************************************!*\
        !*** ./src/app/_components/stations/add-station-modal/add-station-modal.component.css ***!
        \****************************************************************************************/
      /*! no static exports found */
      /***/
      (function(module, exports) {

        module.exports = ".ng-valid[required], .ng-valid.required  {\n  border-left: 5px solid #42A948; /* green */\n}\n\n.ng-invalid:not(form)  {\n  border-left: 5px solid #a94442; /* red */\n}\n\nbutton:hover {\n  background-color: #cfd8dc;\n}\n\nbutton:disabled {\n  background-color: #eee;\n  color: #aaa;\n  cursor: auto;\n}\n\n.btn[disabled], fieldset[disabled] .btn {\n  cursor: not-allowed;\n  filter: alpha(opacity=65);\n  box-shadow: none;\n  opacity: .65;\n}\n\n#mapid{\n  height: 300px;\n  width: 100%;\n}\n\n.modal-lg{\n  max-width: 75%;\n}\n"

        /***/
      }),

    /***/
    "./src/app/_components/stations/add-station-modal/add-station-modal.component.html":
      /*!*****************************************************************************************!*\
        !*** ./src/app/_components/stations/add-station-modal/add-station-modal.component.html ***!
        \*****************************************************************************************/
      /*! no static exports found */
      /***/
      (function(module, exports) {

        module.exports = "<div class=\"modal-dialog modal-dialog-centered modal-lg\" role=\"document\">\n  <div class=\"modal-content\">\n    <div class=\"modal-header\">\n      <h1 class=\"modal-title\" id=\"addStationModalLabel\">Ajouter une station</h1>\n      <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n        <span aria-hidden=\"true\">&times;</span>\n      </button>\n    </div>\n    <div class=\"modal-body\">\n      <div class=\"container\">\n        <form (ngSubmit)=\"onSubmit()\" [formGroup]=\"addStationForm\" #addStationFormNg=\"ngForm\">\n          <div class=\"row\">\n            <div class=\"col-md-6\">\n\n\n              <div class=\"form-group\">\n                <input id=\"name\" class=\"form-control\" placeholder=\"Nom\"\n                       formControlName=\"name\" required\n                       >\n                <div *ngIf=\"name.invalid && (name.dirty || name.touched)\"\n                     class=\"alert alert-danger\">\n                  <div *ngIf=\"name.errors.required\">\n                    Le nom est requis.\n                  </div>\n                  <div *ngIf=\"name.errors.maxlength\">\n                    Le nom ne peut pas dépasser 20 caractères.\n                  </div>\n                </div>\n              </div>\n              <div class=\"row\">\n                <div class=\"col-md-4\">\n                  <div class=\"form-group\">\n\n                    <select class=\"form-control\" id=\"interval\"\n                            formControlName=\"interval\" required>\n                      <option value=\"\" disabled selected>Intervalle</option>\n                      <option *ngFor=\"let i of intervals\" [value]=\"i\">{{i}}</option>\n                    </select>\n\n                    <div *ngIf=\"interval.invalid && (interval.dirty || interval.touched)\"\n                         class=\"alert alert-danger\">\n                      <div *ngIf=\"interval.errors.required\">\n                        Une intervalle est requise\n                      </div>\n                    </div>\n                  </div>\n                </div>\n              </div>\n\n\n              <div class=\"row\">\n                <div class=\"col-md\">\n                  <div class=\"form-group\">\n                    <input type=\"number\" class=\"form-control\" id=\"latitude\" placeholder=\"Latitude\"\n                           formControlName=\"latitude\" required>\n                    <div *ngIf=\"latitude.invalid && (latitude.dirty || latitude.touched)\" class=\"alert alert-danger\">\n                      <div *ngIf=\"latitude.errors.required\">\n                        La latitude est requise\n                      </div>\n                      <div *ngIf=\"latitude.errors.min\">\n                        La valeur est trop petite\n                      </div>\n                      <div *ngIf=\"latitude.errors.max\">\n                        La valeur est trop grande\n                      </div>\n                    </div>\n                  </div>\n                </div>\n                <div class=\"col-md\">\n                  <div class=\"form-group\">\n                    <input type=\"number\" class=\"form-control\" id=\"longitude\" placeholder=\"Longitude\"\n                           formControlName=\"longitude\" required>\n                    <div *ngIf=\"longitude.invalid && (longitude.dirty || longitude.touched)\"\n                         class=\"alert alert-danger\">\n                      <div *ngIf=\"longitude.errors.required\">\n                        La longitude est requise\n                      </div>\n                      <div *ngIf=\"longitude.errors.min\">\n                        La valeur est trop petite\n                      </div>\n                      <div *ngIf=\"longitude.errors.max\">\n                        La valeur est trop grande\n                      </div>\n                    </div>\n                  </div>\n                </div>\n                <div class=\"col-md\">\n                  <div class=\"form-group\">\n                    <input type=\"number\" class=\"form-control\" id=\"altitude\" placeholder=\"Altitude\"\n                           formControlName=\"altitude\" required>\n                    <div *ngIf=\"altitude.invalid && (altitude.dirty || altitude.touched)\"\n                         class=\"alert alert-danger\">\n                      <div *ngIf=\"altitude.errors.required\">\n                        La longitude est requise\n                      </div>\n                      <div *ngIf=\"altitude.errors.min\">\n                        La valeur est trop petite\n                      </div>\n                      <div *ngIf=\"altitude.errors.max\">\n                        La valeur est trop grande\n                      </div>\n                    </div>\n                  </div>\n                </div>\n              </div>\n\n              <div class=\"row\">\n                <div class=\"col-md\">\n                  <div class=\"form-group\">\n                    <input id=\"createdAt\" placeholder=\"Date de création\" type=\"text\"\n                           class=\"flatpickr flatpickr-input form-control\"\n                           formControlName=\"createdAt\" required>\n                    <div *ngIf=\"createdAt.invalid && (createdAt.dirty || createdAt.touched)\"\n                         class=\"alert alert-danger\">\n                      <div *ngIf=\"createdAt.errors.required\">\n                        La longitude est requise\n                      </div>\n                    </div>\n                  </div>\n                </div>\n                <div class=\"col-md\">\n\n                </div>\n              </div>\n\n            </div>\n            <div class=\"col-md-6\">\n              <div id=\"mapid\">\n              </div>\n            </div>\n          </div>\n\n          <!--<div class=\"row\">\n            <div class=\"col-sm\">\n              <div class=\"form-group\">\n                &lt;!&ndash;TODO make your business here!! &ndash;&gt;\n                <label for=\"longitude\">Note</label>\n                <textarea rows=\"6\" class=\"form-control\" id=\"longitude\"\n                          formControlName=\"longitude\" required\"></textarea>\n\n              </div>\n            </div>\n          </div>-->\n\n          <div class=\"modal-footer\">\n            <button type=\"button\" class=\"btn btn-primary\" (click)=\"addStationFormNg.resetForm({})\">Reset\n              station\n            </button>\n            <button (click)=\"resetStation()\" type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Fermer\n            </button>\n            <button (click)=\"sendStation()\" type=\"submit\" class=\"btn btn-success\"\n                    [disabled]=\"!addStationFormNg.form.valid\">Envoyer\n            </button>\n          </div>\n        </form>\n\n      </div>\n    </div>\n  </div>\n</div>\n"

        /***/
      }),

    /***/
    "./src/app/_components/stations/add-station-modal/add-station-modal.component.ts":
      /*!***************************************************************************************!*\
        !*** ./src/app/_components/stations/add-station-modal/add-station-modal.component.ts ***!
        \***************************************************************************************/
      /*! exports provided: AddStationModalComponent */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "AddStationModalComponent", function() { return AddStationModalComponent; });
        /* harmony import */
        var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
        /* harmony import */
        var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
        /* harmony import */
        var _services__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! ../../../_services */ "./src/app/_services/index.ts");
        /* harmony import */
        var _services_stations_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__( /*! ../../../_services/stations.service */ "./src/app/_services/stations.service.ts");
        /* harmony import */
        var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__( /*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
        /* harmony import */
        var _models__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__( /*! ../../../_models */ "./src/app/_models/index.ts");
        /* harmony import */
        var flatpickr__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__( /*! flatpickr */ "./node_modules/flatpickr/dist/flatpickr.js");
        /* harmony import */
        var flatpickr__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/ __webpack_require__.n(flatpickr__WEBPACK_IMPORTED_MODULE_6__);
        /* harmony import */
        var flatpickr_dist_l10n_fr__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__( /*! flatpickr/dist/l10n/fr */ "./node_modules/flatpickr/dist/l10n/fr.js");
        /* harmony import */
        var flatpickr_dist_l10n_fr__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/ __webpack_require__.n(flatpickr_dist_l10n_fr__WEBPACK_IMPORTED_MODULE_7__);
        /* harmony import */
        var leaflet__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__( /*! leaflet */ "./node_modules/leaflet/dist/leaflet-src.js");
        /* harmony import */
        var leaflet__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/ __webpack_require__.n(leaflet__WEBPACK_IMPORTED_MODULE_8__);
        var __decorate = (undefined && undefined.__decorate) || function(decorators, target, key, desc) {
          var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
          if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
          else
            for (var i = decorators.length - 1; i >= 0; i--)
              if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
          return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
        var __metadata = (undefined && undefined.__metadata) || function(k, v) {
          if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
        };









        var AddStationModalComponent = /** @class */ (function() {
          function AddStationModalComponent(alertService, stationService) {
            this.alertService = alertService;
            this.stationService = stationService;
            this.sent = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
            this.intervals = ['1min', '5min', '10min', '15min', '30min', '1h', '2h', '6h', '12h', '24h'];
            this.submitted = false;
          }
          AddStationModalComponent.prototype.ngOnInit = function() {
            this.addStationForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormGroup"]({
              'name': new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormControl"]('', [
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].required,
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].maxLength(20)
              ]),
              'latitude': new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormControl"](undefined, [
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].required,
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].max(90),
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].min(-90)
              ]),
              'longitude': new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormControl"](undefined, [
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].required,
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].max(180),
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].min(-180)
              ]),
              'altitude': new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormControl"](undefined, [
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].required,
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].max(10000),
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].min(0)
              ]),
              'interval': new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormControl"]('', [
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].required
              ]),
              'createdAt': new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormControl"](null, [
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].required
              ])
              //Ajouter la méthode get è
            });
            this.initDatePickerAndMap();
          };
          Object.defineProperty(AddStationModalComponent.prototype, "name", {
            get: function() { return this.addStationForm.get('name'); },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(AddStationModalComponent.prototype, "latitude", {
            get: function() { return this.addStationForm.get('latitude'); },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(AddStationModalComponent.prototype, "longitude", {
            get: function() { return this.addStationForm.get('longitude'); },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(AddStationModalComponent.prototype, "interval", {
            get: function() { return this.addStationForm.get('interval'); },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(AddStationModalComponent.prototype, "createdAt", {
            get: function() { return this.addStationForm.get('createdAt'); },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(AddStationModalComponent.prototype, "altitude", {
            get: function() { return this.addStationForm.get('altitude'); },
            enumerable: true,
            configurable: true
          });
          AddStationModalComponent.prototype.ngAfterViewChecked = function() {
            this.map.invalidateSize();
          };
          AddStationModalComponent.prototype.onSubmit = function() { this.submitted = true; };
          AddStationModalComponent.prototype.resetStation = function() {
            this.datePicker.setDate(null);
            this.map.removeLayer(this.mark);
          };
          AddStationModalComponent.prototype.sendStation = function() {
            var _this = this;
            this.submitted = true;
            // stop here if form is invalid
            if (this.addStationForm.invalid) {
              return;
            }
            var s = new _models__WEBPACK_IMPORTED_MODULE_5__["Station"]();
            s.name = this.addStationForm.controls['name'].value;
            s.latitude = this.addStationForm.controls['latitude'].value;
            s.longitude = this.addStationForm.controls['longitude'].value;
            s.altitude = this.addStationForm.controls['altitude'].value;
            s.interval = this.addStationForm.controls['interval'].value;
            s.createdAt = this.addStationForm.controls['createdAt'].value;
            this.stationService.register(s)
              .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["first"])())
              .subscribe(function(result) {
                //trigger sent
                _this.sent.emit(true);
                //Fermer la page
                var element = document.getElementsByClassName('btn')[1];
                element.click();
                //this.resetStation();
                _this.alertService.success("La station a été ajoutée");
              }, function(error) {
                _this.alertService.error(error);
              });
          };
          AddStationModalComponent.prototype.initDatePickerAndMap = function() {
            var self = this;
            this.datePicker = flatpickr__WEBPACK_IMPORTED_MODULE_6___default()("#createdAt", {
              locale: flatpickr_dist_l10n_fr__WEBPACK_IMPORTED_MODULE_7__["French"],
              altInput: true,
              altFormat: "d-m-Y",
              dateFormat: "d-m-Y",
              onChange: function(selectedDates, dateStr, instance) {
                self.addStationForm.controls['createdAt'].setValue(new Date(selectedDates[0]));
              }
            });
            var icon1 = leaflet__WEBPACK_IMPORTED_MODULE_8__["icon"]({
              iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/images/marker-icon.png',
              iconSize: [20, 35],
              iconAnchor: [11, 34],
              popupAnchor: [-3, -38] // point from which the popup should open relative to the iconAnchor
            });
            var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
              '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
              'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
            // Maps usage : OpenStreetMap, OpenSurferMaps
            var mapLayer2 = leaflet__WEBPACK_IMPORTED_MODULE_8__["tileLayer"]('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
                id: 'mapbox.light',
                attribution: mbAttr
              }),
              mapLayer1 = leaflet__WEBPACK_IMPORTED_MODULE_8__["tileLayer"]('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                id: 'mapbox.streets',
                attribution: mbAttr
              }),
              mapLayer3 = leaflet__WEBPACK_IMPORTED_MODULE_8__["tileLayer"]('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                id: 'mapbox.streets',
                attribution: mbAttr
              });
            var baseLayers = {
              'Grayscale': mapLayer1,
              'Opentopomap': mapLayer2,
              'OpenStreetMap': mapLayer3
            };
            this.map = leaflet__WEBPACK_IMPORTED_MODULE_8__["map"]('mapid', {
              center: [19.099041, -72.658473],
              zoom: 7,
              minZoom: 7,
              maxZoom: 18,
              layers: [mapLayer1]
            });
            leaflet__WEBPACK_IMPORTED_MODULE_8__["control"].scale().addTo(this.map);
            leaflet__WEBPACK_IMPORTED_MODULE_8__["control"].layers(baseLayers).addTo(this.map);
            /*    if (self.station.latitude != undefined && self.station.latitude != undefined) {
                  self.mark = L.marker([self.station.latitude, self.station.longitude], {icon: icon1}).addTo(self.map);
                }else {
                  this.mark = L.marker([0, 0], {icon: icon1});
                }*/
            this.mark = leaflet__WEBPACK_IMPORTED_MODULE_8__["marker"]([0, 0], { icon: icon1 });
            this.map.on('click', function(e) {
              // @ts-ignore
              var latln = e.latlng;
              self.addStationForm.controls['latitude'].setValue(latln.lat);
              self.addStationForm.controls['longitude'].setValue(latln.lng);
              self.mark.setLatLng(latln);
              self.mark.addTo(self.map);
            });
          };
          __decorate([
            Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
            __metadata("design:type", Object)
          ], AddStationModalComponent.prototype, "sent", void 0);
          AddStationModalComponent = __decorate([
            Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
              selector: 'app-add-station-modal',
              template: __webpack_require__( /*! ./add-station-modal.component.html */ "./src/app/_components/stations/add-station-modal/add-station-modal.component.html"),
              styles: [__webpack_require__( /*! ./add-station-modal.component.css */ "./src/app/_components/stations/add-station-modal/add-station-modal.component.css")]
            }),
            __metadata("design:paramtypes", [_services__WEBPACK_IMPORTED_MODULE_2__["AlertService"],
              _services_stations_service__WEBPACK_IMPORTED_MODULE_3__["StationsService"]
            ])
          ], AddStationModalComponent);
          return AddStationModalComponent;
        }());



        /***/
      }),

    /***/
    "./src/app/_components/stations/delete-station-modal/delete-station-modal.component.css":
      /*!**********************************************************************************************!*\
        !*** ./src/app/_components/stations/delete-station-modal/delete-station-modal.component.css ***!
        \**********************************************************************************************/
      /*! no static exports found */
      /***/
      (function(module, exports) {

        module.exports = ""

        /***/
      }),

    /***/
    "./src/app/_components/stations/delete-station-modal/delete-station-modal.component.html":
      /*!***********************************************************************************************!*\
        !*** ./src/app/_components/stations/delete-station-modal/delete-station-modal.component.html ***!
        \***********************************************************************************************/
      /*! no static exports found */
      /***/
      (function(module, exports) {

        module.exports = "<div class=\"modal-dialog\" role=\"document\">\n  <div class=\"modal-content\">\n    <div class=\"modal-header\">\n      <h5 class=\"modal-title\">Supprimer une station</h5>\n      <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n        <span aria-hidden=\"true\">&times;</span>\n      </button>\n    </div>\n    <div class=\"modal-body\">\n      <p>Etes vous sur de vouloir supprimer la station {{station}} ? </p>\n    </div>\n    <div class=\"modal-footer\">\n      <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\" (click)=\"selectAnswer(false)\">Non</button>\n      <button type=\"button\" class=\"btn btn-primary\" data-dismiss=\"modal\" (click)=\"selectAnswer(true)\">Oui</button>\n    </div>\n  </div>\n</div>\n"

        /***/
      }),

    /***/
    "./src/app/_components/stations/delete-station-modal/delete-station-modal.component.ts":
      /*!*********************************************************************************************!*\
        !*** ./src/app/_components/stations/delete-station-modal/delete-station-modal.component.ts ***!
        \*********************************************************************************************/
      /*! exports provided: DeleteStationModalComponent */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "DeleteStationModalComponent", function() { return DeleteStationModalComponent; });
        /* harmony import */
        var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
        var __decorate = (undefined && undefined.__decorate) || function(decorators, target, key, desc) {
          var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
          if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
          else
            for (var i = decorators.length - 1; i >= 0; i--)
              if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
          return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
        var __metadata = (undefined && undefined.__metadata) || function(k, v) {
          if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
        };

        var DeleteStationModalComponent = /** @class */ (function() {
          function DeleteStationModalComponent() {
            this.selected = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
          }
          DeleteStationModalComponent.prototype.ngOnInit = function() {};
          DeleteStationModalComponent.prototype.selectAnswer = function(agreed) {
            this.selected.emit(agreed);
          };
          __decorate([
            Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
            __metadata("design:type", String)
          ], DeleteStationModalComponent.prototype, "station", void 0);
          __decorate([
            Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
            __metadata("design:type", Object)
          ], DeleteStationModalComponent.prototype, "selected", void 0);
          DeleteStationModalComponent = __decorate([
            Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
              selector: 'app-delete-station-modal',
              template: __webpack_require__( /*! ./delete-station-modal.component.html */ "./src/app/_components/stations/delete-station-modal/delete-station-modal.component.html"),
              styles: [__webpack_require__( /*! ./delete-station-modal.component.css */ "./src/app/_components/stations/delete-station-modal/delete-station-modal.component.css")]
            }),
            __metadata("design:paramtypes", [])
          ], DeleteStationModalComponent);
          return DeleteStationModalComponent;
        }());



        /***/
      }),

    /***/
    "./src/app/_components/stations/stations.component.css":
      /*!*************************************************************!*\
        !*** ./src/app/_components/stations/stations.component.css ***!
        \*************************************************************/
      /*! no static exports found */
      /***/
      (function(module, exports) {

        module.exports = ".fa-edit{\n  color: blue;\n}\n\n.fa-file-download{\n  color: green;\n}\n\n.fa-trash{\n  color: red;\n}\n\n.fa-plus-circle{\n  color: blue;\n}\n\n.fas{\n  cursor: pointer;\n}\n\n.fa-sort{\n  cursor: pointer;\n}\n\n.backdrop{\n  background-color:rgba(0,0,0,0.6);\n  position:fixed;\n  top:0;\n  left:0;\n  width:100%;\n  height:100vh;\n}\n\n"

        /***/
      }),

    /***/
    "./src/app/_components/stations/stations.component.html":
      /*!**************************************************************!*\
        !*** ./src/app/_components/stations/stations.component.html ***!
        \**************************************************************/
      /*! no static exports found */
      /***/
      (function(module, exports) {

        module.exports = "<h1>Gestion de mes stations </h1>\r\n\r\n<label>Recherche:\r\n  <input type=\"text\">\r\n</label>\r\n\r\n<!-- Button trigger modal -->\r\n<i class=\"float-right fas fa-plus-circle fa-2x\" data-toggle=\"modal\" data-target=\"#addStationModal\">\r\n</i>\r\n\r\n\r\n\r\n<table class=\"table table-striped table-bordered\">\r\n  <thead>\r\n    <tr>\r\n      <th>#</th>\r\n      <th *ngFor=\"let head of headers\">\r\n\r\n        {{head}}\r\n        <i class=\"fa fa-sort float-right\" aria-hidden=\"true\" (click)=\"sortData(head)\"></i>\r\n      </th>\r\n      <th>Action</th>\r\n    </tr>\r\n  </thead>\r\n  <tbody>\r\n    <tr *ngFor=\"let station of stations; index as i;\">\r\n      <td>{{i+1}}</td>\r\n      <td>{{station.name}}</td>\r\n      <td>{{station.latitude}}</td>\r\n      <td>{{station.longitude}}</td>\r\n      <td>{{station.altitude}}</td>\r\n      <td>{{station.state}}</td>\r\n      <td>{{station.createdAt | date: 'd/MM/yyyy'}}</td>\r\n      <td>{{station.updatedAt | date: 'd/MM/yyyy, h:mm a'}}</td>\r\n      <td>{{station.interval}}</td>\r\n      <td>\r\n        <i class=\"fas fa-edit fa-fw fa-1x\" (click)=\"assignStationToUpdate(station)\" data-toggle=\"modal\" data-target=\"#updateStationModal\"></i>\r\n        <i class=\"fas fa-file-download fa-fw fa-1x\"></i>\r\n        <i class=\"fas fa-trash fa-fw fa-1x\" (click)=\"assignStationToDelete(station)\" data-toggle=\"modal\" data-target=\"#deleteStationModal\"></i>\r\n      </td>\r\n    </tr>\r\n  </tbody>\r\n</table>\r\n\r\n<nav aria-label=\"Page navigation example\">\r\n  <ul class=\"pagination justify-content-end\">\r\n    <li class=\"page-item disabled\">\r\n      <a class=\"page-link\" href=\"#\" tabindex=\"-1\">Previous</a>\r\n    </li>\r\n    <li class=\"page-item\"><a class=\"page-link\" href=\"#\">1</a></li>\r\n    <li class=\"page-item\"><a class=\"page-link\" href=\"#\">2</a></li>\r\n    <li class=\"page-item\"><a class=\"page-link\" href=\"#\">3</a></li>\r\n    <li class=\"page-item\">\r\n      <a class=\"page-link\" href=\"#\">Next</a>\r\n    </li>\r\n  </ul>\r\n</nav>\r\n\r\n<!-- Modal -->\r\n<div class=\"modal fade\" id=\"addStationModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"addStationModalLabel\" aria-hidden=\"true\">\r\n  <app-add-station-modal (sent)=\"loadAllStations($event)\">\r\n    ></app-add-station-modal>\r\n</div>\r\n\r\n<!-- Modal -->\r\n<div class=\"modal fade\" id=\"deleteStationModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"deleteStationModalLabel\" aria-hidden=\"true\">\r\n  <app-delete-station-modal [station]=stationToDelete.name (selected)=\"deleteStation($event)\"></app-delete-station-modal>\r\n</div>\r\n\r\n<!-- Modal -->\r\n<div class=\"modal fade\" id=\"updateStationModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"updateStationModalLabel\" aria-hidden=\"true\">\r\n  <div *ngIf=\"stationToUpdate != null\">\r\n    <app-update-sation-modal [stationToUpdate]=stationToUpdate (updated)=\"loadAllStations($event)\"></app-update-sation-modal>\r\n  </div>\r\n</div>\r\n"

        /***/
      }),

    /***/
    "./src/app/_components/stations/stations.component.ts":
      /*!************************************************************!*\
        !*** ./src/app/_components/stations/stations.component.ts ***!
        \************************************************************/
      /*! exports provided: StationsComponent */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "StationsComponent", function() { return StationsComponent; });
        /* harmony import */
        var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
        /* harmony import */
        var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
        /* harmony import */
        var _models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! ../../_models */ "./src/app/_models/index.ts");
        /* harmony import */
        var _services_stations_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__( /*! ../../_services/stations.service */ "./src/app/_services/stations.service.ts");
        var __decorate = (undefined && undefined.__decorate) || function(decorators, target, key, desc) {
          var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
          if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
          else
            for (var i = decorators.length - 1; i >= 0; i--)
              if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
          return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
        var __metadata = (undefined && undefined.__metadata) || function(k, v) {
          if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
        };




        var StationsComponent = /** @class */ (function() {
          function StationsComponent(stationService) {
            this.stationService = stationService;
            this.stations = [];
            this.headers = ["Nom", "Latitude", "Longitude", "Altitude", "Etat", "Créé le", "Dernière modification", "Intervalle"];
          }
          StationsComponent.prototype.ngOnInit = function() {
            this.loadAllStations();
            this.stationToDelete = new _models__WEBPACK_IMPORTED_MODULE_2__["Station"]();
            this.stationToUpdate = null;
          };
          StationsComponent.prototype.loadAllStations = function() {
            var _this = this;
            this.stationService.getAll()
              .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["first"])())
              .subscribe(function(result) {
                _this.stations = result;
              });
          };
          StationsComponent.prototype.assignStationToDelete = function(station) {
            this.stationToDelete = station;
          };
          StationsComponent.prototype.assignStationToUpdate = function(station) {
            this.stationToUpdate = station;
            // console.log(this.stationToUpdate)
          };
          StationsComponent.prototype.deleteStation = function(choice) {
            var _this = this;
            if (choice) {
              this.stationService.delete(this.stationToDelete._id)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["first"])())
                .subscribe(function(result) {
                  _this.loadAllStations();
                });
            } else {
              this.stationToDelete = new _models__WEBPACK_IMPORTED_MODULE_2__["Station"]();
            }
          };
          StationsComponent.prototype.sortData = function(headName) {
            switch (headName) {
              case "Nom":
                if (this.stations[0].name < this.stations[1].name) {
                  this.stations.sort(function(val1, val2) { return val1.name > val2.name ? -1 : 1; });
                } else {
                  this.stations.sort(function(val1, val2) { return val2.name > val1.name ? -1 : 1; });
                }
                break;
              case "Latitude":
                if (this.stations[0].latitude < this.stations[1].latitude) {
                  this.stations.sort(function(val1, val2) { return val1.latitude > val2.latitude ? -1 : 1; });
                } else {
                  this.stations.sort(function(val1, val2) { return val2.latitude > val1.latitude ? -1 : 1; });
                }
                break;
              case "Longitude":
                if (this.stations[0].longitude < this.stations[1].longitude) {
                  this.stations.sort(function(val1, val2) { return val1.longitude > val2.longitude ? -1 : 1; });
                } else {
                  this.stations.sort(function(val1, val2) { return val2.longitude > val1.longitude ? -1 : 1; });
                }
                break;
              case "Altitude":
                if (this.stations[0].altitude < this.stations[1].altitude) {
                  this.stations.sort(function(val1, val2) { return val1.altitude > val2.altitude ? -1 : 1; });
                } else {
                  this.stations.sort(function(val1, val2) { return val2.altitude > val1.altitude ? -1 : 1; });
                }
                break;
              case "Intervalle":
                if (this.stations[0].interval < this.stations[1].interval) {
                  this.stations.sort(function(val1, val2) { return val1.interval > val2.interval ? -1 : 1; });
                } else {
                  this.stations.sort(function(val1, val2) { return val2.interval > val1.interval ? -1 : 1; });
                }
                break;
              case "Etat":
                if (this.stations[0].state < this.stations[1].state) {
                  this.stations.sort(function(val1, val2) { return val1.state > val2.state ? -1 : 1; });
                } else {
                  this.stations.sort(function(val1, val2) { return val2.state > val1.state ? -1 : 1; });
                }
                break;
              case "Créé le":
                if (this.stations[0].createdAt < this.stations[1].createdAt) {
                  this.stations.sort(function(val1, val2) { return val1.createdAt > val2.createdAt ? -1 : 1; });
                } else {
                  this.stations.sort(function(val1, val2) { return val2.createdAt > val1.createdAt ? -1 : 1; });
                }
                break;
              case "Dernière modification":
                if (this.stations[0].updatedAt < this.stations[1].updatedAt) {
                  this.stations.sort(function(val1, val2) { return val1.updatedAt > val2.updatedAt ? -1 : 1; });
                } else {
                  this.stations.sort(function(val1, val2) { return val2.updatedAt > val1.updatedAt ? -1 : 1; });
                }
                break;
            }
          };
          StationsComponent = __decorate([
            Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
              selector: 'app-stations',
              template: __webpack_require__( /*! ./stations.component.html */ "./src/app/_components/stations/stations.component.html"),
              styles: [__webpack_require__( /*! ./stations.component.css */ "./src/app/_components/stations/stations.component.css")]
            }),
            __metadata("design:paramtypes", [_services_stations_service__WEBPACK_IMPORTED_MODULE_3__["StationsService"]])
          ], StationsComponent);
          return StationsComponent;
        }());



        /***/
      }),

    /***/
    "./src/app/_components/stations/update-sation-modal/update-sation-modal.component.css":
      /*!********************************************************************************************!*\
        !*** ./src/app/_components/stations/update-sation-modal/update-sation-modal.component.css ***!
        \********************************************************************************************/
      /*! no static exports found */
      /***/
      (function(module, exports) {

        module.exports = ".ng-valid[required], .ng-valid.required  {\n  border-left: 5px solid #42A948; /* green */\n}\n\n.ng-invalid:not(form)  {\n  border-left: 5px solid #a94442; /* red */\n}\n\nbutton:hover {\n  background-color: #cfd8dc;\n}\n\nbutton:disabled {\n  background-color: #eee;\n  color: #aaa;\n  cursor: auto;\n}\n\n.btn[disabled], fieldset[disabled] .btn {\n  cursor: not-allowed;\n  filter: alpha(opacity=65);\n  box-shadow: none;\n  opacity: .65;\n}\n"

        /***/
      }),

    /***/
    "./src/app/_components/stations/update-sation-modal/update-sation-modal.component.html":
      /*!*********************************************************************************************!*\
        !*** ./src/app/_components/stations/update-sation-modal/update-sation-modal.component.html ***!
        \*********************************************************************************************/
      /*! no static exports found */
      /***/
      (function(module, exports) {

        module.exports = "<div class=\"modal-dialog modal-dialog-centered modal-lg\" role=\"document\">\n  <div class=\"modal-content\">\n    <div class=\"modal-header\">\n      <h1 class=\"modal-title\" id=\"addStationModalLabel\">Modifier une station</h1>\n      <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n        <span aria-hidden=\"true\">&times;</span>\n      </button>\n    </div>\n    <div class=\"modal-body\">\n      <div class=\"container\">\n        <form (ngSubmit)=\"onSubmit()\" [formGroup]=\"addStationForm\" #addStationFormNg=\"ngForm\">\n\n          <div class=\"form-group\">\n            <label for=\"name\">Name</label>\n            <input id=\"name\" class=\"form-control\"\n                   formControlName=\"name\" required\n                   [(ngModel)]=\"station.name\">\n            <div *ngIf=\"name.invalid && (name.dirty || name.touched)\"\n                 class=\"alert alert-danger\">\n              <div *ngIf=\"name.errors.required\">\n                Le nom est requis.\n              </div>\n              <div *ngIf=\"name.errors.maxlength\">\n                Le nom ne peut pas dépasser 20 caractères.\n              </div>\n            </div>\n          </div>\n\n          <div class=\"form-group\">\n            <label for=\"latitude\">Latitude</label>\n            <input type=\"number\" class=\"form-control\" id=\"latitude\"\n                   formControlName=\"latitude\" required [(ngModel)]=\"station.latitude\">\n            <div *ngIf=\"latitude.invalid && (latitude.dirty || latitude.touched)\" class=\"alert alert-danger\">\n              <div *ngIf=\"latitude.errors.required\">\n                La latitude est requise\n              </div>\n              <div *ngIf=\"latitude.errors.min\">\n                La valeur est trop petite\n              </div>\n              <div *ngIf=\"latitude.errors.max\">\n                La valeur est trop grande\n              </div>\n            </div>\n          </div>\n\n          <div class=\"form-group\">\n            <label for=\"longitude\">Longitude</label>\n            <input type=\"number\" class=\"form-control\" id=\"longitude\"\n                   formControlName=\"longitude\" required [(ngModel)]=\"station.longitude\">\n            <div *ngIf=\"longitude.invalid && (longitude.dirty || longitude.touched)\"\n                 class=\"alert alert-danger\">\n              <div *ngIf=\"longitude.errors.required\">\n                La longitude est requise\n              </div>\n              <div *ngIf=\"longitude.errors.min\">\n                La valeur est trop petite\n              </div>\n              <div *ngIf=\"longitude.errors.max\">\n                La valeur est trop grande\n              </div>\n            </div>\n          </div>\n\n          <div class=\"form-group\">\n            <label for=\"interval\">Intervalle</label>\n            <select class=\"form-control\" id=\"interval\"\n                    formControlName=\"interval\" required [(ngModel)]=\"station.interval\">\n              <option *ngFor=\"let i of intervals\" [value]=\"i\">{{i}}</option>\n            </select>\n            <div *ngIf=\"interval.invalid && (interval.dirty || interval.touched)\"\n                 class=\"alert alert-danger\">\n              <div *ngIf=\"interval.errors.required\">\n                Une intervalle est requise\n              </div>\n            </div>\n          </div>\n\n          <div class=\"form-group\">\n            <label for=\"createdAt\">Date de création</label>\n            <input id=\"createdAt\" type=\"text\" class=\"flatpickr flatpickr-input\" formControlName=\"createdAt\" required (change)=\"updateCreatedDate()\">\n          </div>\n\n\n          <div class=\"modal-footer\">\n            <button type=\"button\" class=\"btn btn-primary\" (click)=\"resetStation(); addStationFormNg.reset()\">Reset station</button>\n            <button (click)=\"resetStation()\" type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Fermer</button>\n            <button (click)=\"sendStation()\" type=\"submit\" class=\"btn btn-success\" [disabled]=\"!addStationFormNg.form.valid\">Envoyer</button>\n          </div>\n        </form>\n      </div>\n    </div>\n  </div>\n</div>\n"

        /***/
      }),

    /***/
    "./src/app/_components/stations/update-sation-modal/update-sation-modal.component.ts":
      /*!*******************************************************************************************!*\
        !*** ./src/app/_components/stations/update-sation-modal/update-sation-modal.component.ts ***!
        \*******************************************************************************************/
      /*! exports provided: UpdateSationModalComponent */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "UpdateSationModalComponent", function() { return UpdateSationModalComponent; });
        /* harmony import */
        var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
        /* harmony import */
        var _models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ../../../_models */ "./src/app/_models/index.ts");
        /* harmony import */
        var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
        /* harmony import */
        var _services__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__( /*! ../../../_services */ "./src/app/_services/index.ts");
        /* harmony import */
        var _services_stations_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__( /*! ../../../_services/stations.service */ "./src/app/_services/stations.service.ts");
        /* harmony import */
        var flatpickr__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__( /*! flatpickr */ "./node_modules/flatpickr/dist/flatpickr.js");
        /* harmony import */
        var flatpickr__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/ __webpack_require__.n(flatpickr__WEBPACK_IMPORTED_MODULE_5__);
        /* harmony import */
        var flatpickr_dist_l10n_fr__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__( /*! flatpickr/dist/l10n/fr */ "./node_modules/flatpickr/dist/l10n/fr.js");
        /* harmony import */
        var flatpickr_dist_l10n_fr__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/ __webpack_require__.n(flatpickr_dist_l10n_fr__WEBPACK_IMPORTED_MODULE_6__);
        /* harmony import */
        var rxjs_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__( /*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
        var __decorate = (undefined && undefined.__decorate) || function(decorators, target, key, desc) {
          var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
          if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
          else
            for (var i = decorators.length - 1; i >= 0; i--)
              if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
          return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
        var __metadata = (undefined && undefined.__metadata) || function(k, v) {
          if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
        };








        var UpdateSationModalComponent = /** @class */ (function() {
          function UpdateSationModalComponent(alertService, stationService) {
            this.alertService = alertService;
            this.stationService = stationService;
            this.updated = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
            this.intervals = ['1min', '5min', '10min', '15min', '30min', '1h', '2h', '6h', '12h', '24h'];
            this.submitted = false;
          }
          UpdateSationModalComponent.prototype.ngOnInit = function() {
            this.station = this.stationToUpdate;
            this.addStationForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormGroup"]({
              'name': new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](this.station.name, [
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required,
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].maxLength(20)
              ]),
              'latitude': new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](this.station.latitude, [
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required,
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].max(90),
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].min(-90)
              ]),
              'longitude': new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](this.station.longitude, [
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required,
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].max(180),
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].min(-180)
              ]),
              'interval': new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](this.station.interval, [
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required
              ]),
              'createdAt': new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](this.station.createdAt, [
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required
              ])
            });
            this.datePicker = flatpickr__WEBPACK_IMPORTED_MODULE_5___default()("#createdAt", {
              defaultDate: this.station.createdAt,
              locale: flatpickr_dist_l10n_fr__WEBPACK_IMPORTED_MODULE_6__["French"],
              altInput: true,
              altFormat: "d-m-Y",
              dateFormat: "d-m-Y"
            });
          };
          UpdateSationModalComponent.prototype.updateCreatedDate = function() {
            this.station.createdAt = new Date(this.datePicker.selectedDates[0]);
          };
          Object.defineProperty(UpdateSationModalComponent.prototype, "name", {
            get: function() { return this.addStationForm.get('name'); },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(UpdateSationModalComponent.prototype, "latitude", {
            get: function() { return this.addStationForm.get('latitude'); },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(UpdateSationModalComponent.prototype, "longitude", {
            get: function() { return this.addStationForm.get('longitude'); },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(UpdateSationModalComponent.prototype, "interval", {
            get: function() { return this.addStationForm.get('interval'); },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(UpdateSationModalComponent.prototype, "createdAt", {
            get: function() { return this.addStationForm.get('createdAt'); },
            enumerable: true,
            configurable: true
          });
          UpdateSationModalComponent.prototype.onSubmit = function() { this.submitted = true; };
          UpdateSationModalComponent.prototype.resetStation = function() {
            this.station = this.stationToUpdate;
            this.datePicker.setDate(this.stationToUpdate.createdAt);
          };
          UpdateSationModalComponent.prototype.sendStation = function() {
            var _this = this;
            this.submitted = true;
            // stop here if form is invalid
            if (this.addStationForm.invalid) {
              return;
            }
            this.stationService.update(this.station)
              .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["first"])())
              .subscribe(function(result) {
                //trigger sent
                _this.updated.emit(true);
                //Fermer la page
              }, function(error) {
                _this.alertService.error(error);
              });
          };
          __decorate([
            Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
            __metadata("design:type", _models__WEBPACK_IMPORTED_MODULE_1__["Station"])
          ], UpdateSationModalComponent.prototype, "stationToUpdate", void 0);
          __decorate([
            Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
            __metadata("design:type", Object)
          ], UpdateSationModalComponent.prototype, "updated", void 0);
          UpdateSationModalComponent = __decorate([
            Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
              selector: 'app-update-sation-modal',
              template: __webpack_require__( /*! ./update-sation-modal.component.html */ "./src/app/_components/stations/update-sation-modal/update-sation-modal.component.html"),
              styles: [__webpack_require__( /*! ./update-sation-modal.component.css */ "./src/app/_components/stations/update-sation-modal/update-sation-modal.component.css")]
            }),
            __metadata("design:paramtypes", [_services__WEBPACK_IMPORTED_MODULE_3__["AlertService"],
              _services_stations_service__WEBPACK_IMPORTED_MODULE_4__["StationsService"]
            ])
          ], UpdateSationModalComponent);
          return UpdateSationModalComponent;
        }());



        /***/
      }),

    /***/
    "./src/app/_components/users/index.ts":
      /*!********************************************!*\
        !*** ./src/app/_components/users/index.ts ***!
        \********************************************/
      /*! exports provided: UsersComponent */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony import */
        var _users_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ./users.component */ "./src/app/_components/users/users.component.ts");
        /* harmony reexport (safe) */
        __webpack_require__.d(__webpack_exports__, "UsersComponent", function() { return _users_component__WEBPACK_IMPORTED_MODULE_0__["UsersComponent"]; });




        /***/
      }),

    /***/
    "./src/app/_components/users/users.component.html":
      /*!********************************************************!*\
        !*** ./src/app/_components/users/users.component.html ***!
        \********************************************************/
      /*! no static exports found */
      /***/
      (function(module, exports) {

        module.exports = "<h1>Hi {{currentUser.mail}}!</h1>\n<p>You're logged in with Angular 6!!</p>\n<h3>All registered users:</h3>\n<ul>\n  <li *ngFor=\"let user of users\">\n    {{user.mail}} ({{user.role}})\n    - <a (click)=\"deleteUser(user._id)\" class=\"text-danger\">Delete</a>\n  </li>\n</ul>\n<p><a [routerLink]=\"['/login']\">Logout</a></p>\n"

        /***/
      }),

    /***/
    "./src/app/_components/users/users.component.ts":
      /*!******************************************************!*\
        !*** ./src/app/_components/users/users.component.ts ***!
        \******************************************************/
      /*! exports provided: UsersComponent */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "UsersComponent", function() { return UsersComponent; });
        /* harmony import */
        var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
        /* harmony import */
        var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
        /* harmony import */
        var _services_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! ../../_services/index */ "./src/app/_services/index.ts");
        /* harmony import */
        var _services_localstorage_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__( /*! ../../_services/localstorage.service */ "./src/app/_services/localstorage.service.ts");
        var __decorate = (undefined && undefined.__decorate) || function(decorators, target, key, desc) {
          var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
          if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
          else
            for (var i = decorators.length - 1; i >= 0; i--)
              if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
          return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
        var __metadata = (undefined && undefined.__metadata) || function(k, v) {
          if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
        };




        var UsersComponent = /** @class */ (function() {
          function UsersComponent(userService, localStorageService) {
            this.userService = userService;
            this.localStorageService = localStorageService;
            this.users = [];
            this.currentUser = this.localStorageService.getItem('currentUser').current;
          }
          UsersComponent.prototype.ngOnInit = function() {
            this.loadAllUsers();
          };
          UsersComponent.prototype.deleteUser = function(id) {
            var _this = this;
            this.userService.delete(id).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["first"])()).subscribe(function() {
              _this.loadAllUsers();
            });
          };
          UsersComponent.prototype.loadAllUsers = function() {
            var _this = this;
            this.userService.getAll().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["first"])()).subscribe(function(result) {
              _this.users = result;
            });
          };
          UsersComponent = __decorate([
            Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({ template: __webpack_require__( /*! ./users.component.html */ "./src/app/_components/users/users.component.html") }),
            __metadata("design:paramtypes", [_services_index__WEBPACK_IMPORTED_MODULE_2__["UserService"], _services_localstorage_service__WEBPACK_IMPORTED_MODULE_3__["LocalstorageService"]])
          ], UsersComponent);
          return UsersComponent;
        }());



        /***/
      }),

    /***/
    "./src/app/_directives/alert.component.html":
      /*!**************************************************!*\
        !*** ./src/app/_directives/alert.component.html ***!
        \**************************************************/
      /*! no static exports found */
      /***/
      (function(module, exports) {

        module.exports = "<div *ngIf=\"message\"\n     [ngClass]=\"{ 'alert': message, 'alert-success': message.type === 'success', 'alert-danger': message.type === 'error' }\">\n  {{message.text}}\n</div>\n"

        /***/
      }),

    /***/
    "./src/app/_directives/alert.component.ts":
      /*!************************************************!*\
        !*** ./src/app/_directives/alert.component.ts ***!
        \************************************************/
      /*! exports provided: AlertComponent */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "AlertComponent", function() { return AlertComponent; });
        /* harmony import */
        var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
        /* harmony import */
        var _services__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ../_services */ "./src/app/_services/index.ts");
        /* harmony import */
        var ngx_toastr__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
        var __decorate = (undefined && undefined.__decorate) || function(decorators, target, key, desc) {
          var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
          if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
          else
            for (var i = decorators.length - 1; i >= 0; i--)
              if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
          return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
        var __metadata = (undefined && undefined.__metadata) || function(k, v) {
          if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
        };



        var AlertComponent = /** @class */ (function() {
          function AlertComponent(alertService, taostr) {
            this.alertService = alertService;
            this.taostr = taostr;
          }
          AlertComponent.prototype.ngOnInit = function() {
            var _this = this;
            this.subscription = this.alertService.getMessage().subscribe(function(message) {
              // this.message = message;
              if (message && message.type) {
                var cssClass = 'alert alert-error';
                if (message.type == "success") {
                  cssClass = 'alert alert-success';
                }
                _this.taostr[message.type](message.text, message.type, {
                  progressBar: true,
                  closeButton: true,
                  timeOut: 10000 //temps en millisecondes
                });
              }
            });
          };
          AlertComponent.prototype.ngOnDestroy = function() {
            this.subscription.unsubscribe();
          };
          AlertComponent = __decorate([
            Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
              selector: 'alert',
              template: __webpack_require__( /*! ./alert.component.html */ "./src/app/_directives/alert.component.html")
            }),
            __metadata("design:paramtypes", [_services__WEBPACK_IMPORTED_MODULE_1__["AlertService"], ngx_toastr__WEBPACK_IMPORTED_MODULE_2__["ToastrService"]])
          ], AlertComponent);
          return AlertComponent;
        }());



        /***/
      }),

    /***/
    "./src/app/_directives/index.ts":
      /*!**************************************!*\
        !*** ./src/app/_directives/index.ts ***!
        \**************************************/
      /*! exports provided: AlertComponent */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony import */
        var _alert_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ./alert.component */ "./src/app/_directives/alert.component.ts");
        /* harmony reexport (safe) */
        __webpack_require__.d(__webpack_exports__, "AlertComponent", function() { return _alert_component__WEBPACK_IMPORTED_MODULE_0__["AlertComponent"]; });




        /***/
      }),

    /***/
    "./src/app/_guards/auth.guard.ts":
      /*!***************************************!*\
        !*** ./src/app/_guards/auth.guard.ts ***!
        \***************************************/
      /*! exports provided: AuthGuard */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "AuthGuard", function() { return AuthGuard; });
        /* harmony import */
        var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
        /* harmony import */
        var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
        /* harmony import */
        var _services_localstorage_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! ../_services/localstorage.service */ "./src/app/_services/localstorage.service.ts");
        var __decorate = (undefined && undefined.__decorate) || function(decorators, target, key, desc) {
          var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
          if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
          else
            for (var i = decorators.length - 1; i >= 0; i--)
              if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
          return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
        var __metadata = (undefined && undefined.__metadata) || function(k, v) {
          if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
        };



        var AuthGuard = /** @class */ (function() {
          function AuthGuard(router, localStorageService) {
            this.router = router;
            this.localStorageService = localStorageService;
          }
          AuthGuard.prototype.canActivate = function(route, state) {
            if (this.localStorageService.getItem('currentUser')) {
              // logged in so return true
              return true;
            }
            // not logged in so redirect to login page with the return url
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
          };
          AuthGuard = __decorate([
            Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
            __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"], _services_localstorage_service__WEBPACK_IMPORTED_MODULE_2__["LocalstorageService"]])
          ], AuthGuard);
          return AuthGuard;
        }());



        /***/
      }),

    /***/
    "./src/app/_guards/index.ts":
      /*!**********************************!*\
        !*** ./src/app/_guards/index.ts ***!
        \**********************************/
      /*! exports provided: AuthGuard */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony import */
        var _auth_guard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ./auth.guard */ "./src/app/_guards/auth.guard.ts");
        /* harmony reexport (safe) */
        __webpack_require__.d(__webpack_exports__, "AuthGuard", function() { return _auth_guard__WEBPACK_IMPORTED_MODULE_0__["AuthGuard"]; });




        /***/
      }),

    /***/
    "./src/app/_helpers/error.interceptor.ts":
      /*!***********************************************!*\
        !*** ./src/app/_helpers/error.interceptor.ts ***!
        \***********************************************/
      /*! exports provided: ErrorInterceptor */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "ErrorInterceptor", function() { return ErrorInterceptor; });
        /* harmony import */
        var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
        /* harmony import */
        var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
        /* harmony import */
        var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
        /* harmony import */
        var _services__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__( /*! ../_services */ "./src/app/_services/index.ts");
        var __decorate = (undefined && undefined.__decorate) || function(decorators, target, key, desc) {
          var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
          if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
          else
            for (var i = decorators.length - 1; i >= 0; i--)
              if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
          return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
        var __metadata = (undefined && undefined.__metadata) || function(k, v) {
          if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
        };




        var ErrorInterceptor = /** @class */ (function() {
          function ErrorInterceptor(authenticationService) {
            this.authenticationService = authenticationService;
          }
          ErrorInterceptor.prototype.intercept = function(request, next) {
            var _this = this;
            return next.handle(request).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function(err) {
              if (err.status === 401) {
                // auto logout if 401 response returned from api
                _this.authenticationService.logout();
                // location.reload(false);
              }
              var error = err.error.message || err.statusText;
              return Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["throwError"])(error);
            }));
          };
          ErrorInterceptor = __decorate([
            Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
            __metadata("design:paramtypes", [_services__WEBPACK_IMPORTED_MODULE_3__["AuthenticationService"]])
          ], ErrorInterceptor);
          return ErrorInterceptor;
        }());



        /***/
      }),

    /***/
    "./src/app/_helpers/index.ts":
      /*!***********************************!*\
        !*** ./src/app/_helpers/index.ts ***!
        \***********************************/
      /*! exports provided: ErrorInterceptor, JwtInterceptor */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony import */
        var _error_interceptor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ./error.interceptor */ "./src/app/_helpers/error.interceptor.ts");
        /* harmony reexport (safe) */
        __webpack_require__.d(__webpack_exports__, "ErrorInterceptor", function() { return _error_interceptor__WEBPACK_IMPORTED_MODULE_0__["ErrorInterceptor"]; });

        /* harmony import */
        var _jwt_interceptor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ./jwt.interceptor */ "./src/app/_helpers/jwt.interceptor.ts");
        /* harmony reexport (safe) */
        __webpack_require__.d(__webpack_exports__, "JwtInterceptor", function() { return _jwt_interceptor__WEBPACK_IMPORTED_MODULE_1__["JwtInterceptor"]; });





        /***/
      }),

    /***/
    "./src/app/_helpers/jwt.interceptor.ts":
      /*!*********************************************!*\
        !*** ./src/app/_helpers/jwt.interceptor.ts ***!
        \*********************************************/
      /*! exports provided: JwtInterceptor */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "JwtInterceptor", function() { return JwtInterceptor; });
        /* harmony import */
        var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
        /* harmony import */
        var _services_localstorage_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ../_services/localstorage.service */ "./src/app/_services/localstorage.service.ts");
        var __decorate = (undefined && undefined.__decorate) || function(decorators, target, key, desc) {
          var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
          if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
          else
            for (var i = decorators.length - 1; i >= 0; i--)
              if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
          return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
        var __metadata = (undefined && undefined.__metadata) || function(k, v) {
          if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
        };


        var JwtInterceptor = /** @class */ (function() {
          function JwtInterceptor(localStorageService) {
            this.localStorageService = localStorageService;
          }
          JwtInterceptor.prototype.intercept = function(request, next) {
            // add authorization header with jwt token if available
            var currentUser = this.localStorageService.getItem('currentUser');
            if (currentUser && currentUser.token) {
              request = request.clone({
                setHeaders: {
                  'x-access-token': currentUser.token,
                  'Content-Type': 'application/json'
                }
              });
            }
            return next.handle(request);
          };
          JwtInterceptor = __decorate([
            Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
            __metadata("design:paramtypes", [_services_localstorage_service__WEBPACK_IMPORTED_MODULE_1__["LocalstorageService"]])
          ], JwtInterceptor);
          return JwtInterceptor;
        }());



        /***/
      }),

    /***/
    "./src/app/_models/index.ts":
      /*!**********************************!*\
        !*** ./src/app/_models/index.ts ***!
        \**********************************/
      /*! exports provided: User, Station */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony import */
        var _user__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ./user */ "./src/app/_models/user.ts");
        /* harmony reexport (safe) */
        __webpack_require__.d(__webpack_exports__, "User", function() { return _user__WEBPACK_IMPORTED_MODULE_0__["User"]; });

        /* harmony import */
        var _station__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ./station */ "./src/app/_models/station.ts");
        /* harmony reexport (safe) */
        __webpack_require__.d(__webpack_exports__, "Station", function() { return _station__WEBPACK_IMPORTED_MODULE_1__["Station"]; });





        /***/
      }),

    /***/
    "./src/app/_models/station.ts":
      /*!************************************!*\
        !*** ./src/app/_models/station.ts ***!
        \************************************/
      /*! exports provided: Station */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "Station", function() { return Station; });
        var Station = /** @class */ (function() {
          function Station() {}
          return Station;
        }());

        //new Station('','',undefined,undefined,'',null,null,'',[]);


        /***/
      }),

    /***/
    "./src/app/_models/user.ts":
      /*!*********************************!*\
        !*** ./src/app/_models/user.ts ***!
        \*********************************/
      /*! exports provided: User */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "User", function() { return User; });
        var User = /** @class */ (function() {
          function User() {}
          return User;
        }());



        /***/
      }),

    /***/
    "./src/app/_services/alert.service.ts":
      /*!********************************************!*\
        !*** ./src/app/_services/alert.service.ts ***!
        \********************************************/
      /*! exports provided: AlertService */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "AlertService", function() { return AlertService; });
        /* harmony import */
        var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
        /* harmony import */
        var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
        /* harmony import */
        var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
        var __decorate = (undefined && undefined.__decorate) || function(decorators, target, key, desc) {
          var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
          if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
          else
            for (var i = decorators.length - 1; i >= 0; i--)
              if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
          return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
        var __metadata = (undefined && undefined.__metadata) || function(k, v) {
          if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
        };



        var AlertService = /** @class */ (function() {
          function AlertService(router) {
            var _this = this;
            this.router = router;
            this.subject = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
            this.keepAfterNavigationChange = false;
            // clear alert message on route change
            router.events.subscribe(function(event) {
              if (event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_1__["NavigationStart"]) {
                if (_this.keepAfterNavigationChange) {
                  // only keep for a single location change
                  _this.keepAfterNavigationChange = false;
                } else {
                  // clear alert
                  _this.subject.next();
                }
              }
            });
          }
          AlertService.prototype.success = function(message, keepAfterNavigationChange) {
            if (keepAfterNavigationChange === void 0) { keepAfterNavigationChange = false; }
            this.keepAfterNavigationChange = keepAfterNavigationChange;
            this.subject.next({ type: 'success', text: message });
          };
          AlertService.prototype.error = function(message, keepAfterNavigationChange) {
            if (keepAfterNavigationChange === void 0) { keepAfterNavigationChange = false; }
            this.keepAfterNavigationChange = keepAfterNavigationChange;
            this.subject.next({ type: 'error', text: message });
          };
          AlertService.prototype.getMessage = function() {
            return this.subject.asObservable();
          };
          AlertService = __decorate([
            Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
            __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]])
          ], AlertService);
          return AlertService;
        }());



        /***/
      }),

    /***/
    "./src/app/_services/authentication.service.ts":
      /*!*****************************************************!*\
        !*** ./src/app/_services/authentication.service.ts ***!
        \*****************************************************/
      /*! exports provided: AuthenticationService */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "AuthenticationService", function() { return AuthenticationService; });
        /* harmony import */
        var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
        /* harmony import */
        var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
        /* harmony import */
        var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
        /* harmony import */
        var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__( /*! ../../environments/environment */ "./src/environments/environment.ts");
        /* harmony import */
        var _localstorage_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__( /*! ./localstorage.service */ "./src/app/_services/localstorage.service.ts");
        var __decorate = (undefined && undefined.__decorate) || function(decorators, target, key, desc) {
          var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
          if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
          else
            for (var i = decorators.length - 1; i >= 0; i--)
              if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
          return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
        var __metadata = (undefined && undefined.__metadata) || function(k, v) {
          if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
        };





        var AuthenticationService = /** @class */ (function() {
          function AuthenticationService(http, localStorageService) {
            this.http = http;
            this.localStorageService = localStorageService;
          }
          AuthenticationService.prototype.login = function(username, password) {
            var _this = this;
            return this.http.post(_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].apiUrl + '/users/login', { mail: username, pwd: password })
              .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function(user) {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  // localStorage.setItem('currentUser', JSON.stringify(user));
                  _this.localStorageService.setItem("currentUser", user);
                }
                return user;
              }));
          };
          AuthenticationService.prototype.isLogged = function() {
            return this.http.get(_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].apiUrl + '/login/test')
              .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function() {}));
          };
          AuthenticationService.prototype.logout = function() {
            // remove user from local storage to log user out
            this.localStorageService.removeItem('currentUser');
          };
          AuthenticationService.prototype.register = function(first_name, last_name, username, password) {
            var _this = this;
            return this.http.post(_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].apiUrl + '/users', {
                first_name: first_name,
                last_name: last_name,
                mail: username,
                pwd: password
              })
              .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function(user) {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  _this.localStorageService.setItem('currentUser', user);
                }
                return user;
              }));
          };
          AuthenticationService.prototype.resetPwd = function(pwd, confirmPwd) {
            var _this = this;
            //TODO change url and param
            return this.http.post(_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].apiUrl + '/users', {})
              .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function(user) {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  _this.localStorageService.setItem('currentUser', user);
                }
                return user;
              }));
          };
          AuthenticationService = __decorate([
            Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
            __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"], _localstorage_service__WEBPACK_IMPORTED_MODULE_4__["LocalstorageService"]])
          ], AuthenticationService);
          return AuthenticationService;
        }());



        /***/
      }),

    /***/
    "./src/app/_services/index.ts":
      /*!************************************!*\
        !*** ./src/app/_services/index.ts ***!
        \************************************/
      /*! exports provided: UserService, AlertService, AuthenticationService */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony import */
        var _alert_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ./alert.service */ "./src/app/_services/alert.service.ts");
        /* harmony reexport (safe) */
        __webpack_require__.d(__webpack_exports__, "AlertService", function() { return _alert_service__WEBPACK_IMPORTED_MODULE_0__["AlertService"]; });

        /* harmony import */
        var _authentication_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ./authentication.service */ "./src/app/_services/authentication.service.ts");
        /* harmony reexport (safe) */
        __webpack_require__.d(__webpack_exports__, "AuthenticationService", function() { return _authentication_service__WEBPACK_IMPORTED_MODULE_1__["AuthenticationService"]; });

        /* harmony import */
        var _user_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! ./user.service */ "./src/app/_services/user.service.ts");
        /* harmony reexport (safe) */
        __webpack_require__.d(__webpack_exports__, "UserService", function() { return _user_service__WEBPACK_IMPORTED_MODULE_2__["UserService"]; });






        /***/
      }),

    /***/
    "./src/app/_services/localstorage.service.ts":
      /*!***************************************************!*\
        !*** ./src/app/_services/localstorage.service.ts ***!
        \***************************************************/
      /*! exports provided: LocalstorageService */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "LocalstorageService", function() { return LocalstorageService; });
        /* harmony import */
        var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
        /* harmony import */
        var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
        var __decorate = (undefined && undefined.__decorate) || function(decorators, target, key, desc) {
          var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
          if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
          else
            for (var i = decorators.length - 1; i >= 0; i--)
              if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
          return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
        var __metadata = (undefined && undefined.__metadata) || function(k, v) {
          if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
        };


        var LocalstorageService = /** @class */ (function() {
          function LocalstorageService() {
            this.storage = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
            this.lStorage = {};
            this.storage$ = this.storage.asObservable();
            this.lStorage = JSON.parse(localStorage.getItem("storage") || '{}');
            this.updateLocalStorage();
          }
          LocalstorageService.prototype.getItem = function(key) {
            return this.lStorage[key];
          };
          LocalstorageService.prototype.setItem = function(key, value) {
            // console.log(key, value); // I have data! Let's return it so subscribers can use it!
            // we can do stuff with data if we want
            this.lStorage[key] = value;
            this.updateLocalStorage();
          };
          LocalstorageService.prototype.removeItem = function(key) {
            delete this.lStorage[key];
            this.updateLocalStorage();
          };
          LocalstorageService.prototype.updateLocalStorage = function() {
            localStorage.setItem("storage", JSON.stringify(this.lStorage));
            this.storage.next(this.lStorage);
          };
          LocalstorageService.prototype.getStorage = function() {
            return this.lStorage;
          };
          LocalstorageService = __decorate([
            Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
              providedIn: 'root'
            }),
            __metadata("design:paramtypes", [])
          ], LocalstorageService);
          return LocalstorageService;
        }());



        /***/
      }),

    /***/
    "./src/app/_services/menu.service.ts":
      /*!*******************************************!*\
        !*** ./src/app/_services/menu.service.ts ***!
        \*******************************************/
      /*! exports provided: MenuService */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "MenuService", function() { return MenuService; });
        /* harmony import */
        var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
        /* harmony import */
        var _localstorage_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ./localstorage.service */ "./src/app/_services/localstorage.service.ts");
        var __decorate = (undefined && undefined.__decorate) || function(decorators, target, key, desc) {
          var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
          if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
          else
            for (var i = decorators.length - 1; i >= 0; i--)
              if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
          return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
        var __metadata = (undefined && undefined.__metadata) || function(k, v) {
          if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
        };


        var MenuService = /** @class */ (function() {
          function MenuService(localStorageService) {
            this.localStorageService = localStorageService;
            this.bigMenuParent = {
              left: {
                all: [],
                viewer: [],
                worker: [{ name: 'Mes stations', path: 'stations' }],
                admin: [{ name: 'Gestion des Utilisateurs', path: 'users' }]
              },
              right: {
                all: [{ name: 'Se connecter', path: 'login' }],
                viewer: [{ name: 'Se déconnecter', path: 'logout' }],
                worker: [],
                admin: [{ name: 'Tableau d\'administration', path: 'admin' }]
              }
            };
            this.currentUser = this.localStorageService.getItem('currentUser');
          }
          MenuService.prototype.getLeftAdminMenu = function() {
            return this.getleftWorkerMenu().concat(this.bigMenuParent.left.admin);
          };
          MenuService.prototype.getleftWorkerMenu = function() {
            return this.getLeftViewerMenu().concat(this.bigMenuParent.left.worker);
          };
          MenuService.prototype.getLeftViewerMenu = function() {
            return this.getMenuLeft().concat(this.bigMenuParent.left.viewer);
          };
          MenuService.prototype.getMenuLeft = function() {
            return this.bigMenuParent.left.all;
          };
          MenuService.prototype.getRightAdminMenu = function() {
            return this.getRightWorkerMenu().concat(this.bigMenuParent.right.admin);
          };
          MenuService.prototype.getRightWorkerMenu = function() {
            return this.getRightViewerMenu().concat(this.bigMenuParent.right.worker);
          };
          MenuService.prototype.getRightViewerMenu = function() {
            return this.getMenuRight().concat(this.bigMenuParent.right.viewer);
          };
          MenuService.prototype.getMenuRight = function() {
            return this.bigMenuParent.right.all;
          };
          MenuService = __decorate([
            Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
              providedIn: 'root'
            }),
            __metadata("design:paramtypes", [_localstorage_service__WEBPACK_IMPORTED_MODULE_1__["LocalstorageService"]])
          ], MenuService);
          return MenuService;
        }());



        /***/
      }),

    /***/
    "./src/app/_services/stations.service.ts":
      /*!***********************************************!*\
        !*** ./src/app/_services/stations.service.ts ***!
        \***********************************************/
      /*! exports provided: StationsService */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "StationsService", function() { return StationsService; });
        /* harmony import */
        var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
        /* harmony import */
        var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
        /* harmony import */
        var _environments_environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! ../../environments/environment */ "./src/environments/environment.ts");
        var __decorate = (undefined && undefined.__decorate) || function(decorators, target, key, desc) {
          var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
          if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
          else
            for (var i = decorators.length - 1; i >= 0; i--)
              if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
          return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
        var __metadata = (undefined && undefined.__metadata) || function(k, v) {
          if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
        };



        var StationsService = /** @class */ (function() {
          function StationsService(http) {
            this.http = http;
          }
          StationsService.prototype.getIntervals = function() {
            return this.http.get(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].apiUrl + '/stations/getInfo/intervals');
          };
          StationsService.prototype.getAll = function() {
            return this.http.get(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].apiUrl + '/stations');
          };
          StationsService.prototype.getById = function(id) {
            return this.http.get(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].apiUrl + '/stations/' + id);
          };
          StationsService.prototype.register = function(station) {
            return this.http.post(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].apiUrl + '/stations', JSON.stringify({ station: station }));
          };
          StationsService.prototype.update = function(station) {
            return this.http.put(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].apiUrl + '/stations/' + station._id, station);
          };
          StationsService.prototype.delete = function(id) {
            return this.http.delete(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].apiUrl + '/stations/' + id);
          };
          StationsService = __decorate([
            Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
              providedIn: 'root'
            }),
            __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]])
          ], StationsService);
          return StationsService;
        }());



        /***/
      }),

    /***/
    "./src/app/_services/user.service.ts":
      /*!*******************************************!*\
        !*** ./src/app/_services/user.service.ts ***!
        \*******************************************/
      /*! exports provided: UserService */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "UserService", function() { return UserService; });
        /* harmony import */
        var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
        /* harmony import */
        var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
        /* harmony import */
        var _environments_environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! ../../environments/environment */ "./src/environments/environment.ts");
        var __decorate = (undefined && undefined.__decorate) || function(decorators, target, key, desc) {
          var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
          if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
          else
            for (var i = decorators.length - 1; i >= 0; i--)
              if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
          return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
        var __metadata = (undefined && undefined.__metadata) || function(k, v) {
          if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
        };



        var UserService = /** @class */ (function() {
          function UserService(http) {
            this.http = http;
          }
          UserService.prototype.getAll = function() {
            return this.http.get(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].apiUrl + '/users');
          };
          UserService.prototype.getAllAwaiting = function() {
            return this.http.get(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].apiUrl + '/users/getAllAwaiting');
          };
          UserService.prototype.getById = function(id) {
            return this.http.get(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].apiUrl + '/users/' + id);
          };
          UserService.prototype.register = function(user) {
            return this.http.post(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].apiUrl + '/users', user);
          };
          UserService.prototype.acceptUser = function(id) {
            return this.http.post(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].apiUrl + '/users/acceptUser', { id: id });
          };
          UserService.prototype.refuseUser = function(id, reason) {
            return this.http.post(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].apiUrl + '/users/refuse', { id: id, reason: reason });
          };
          UserService.prototype.update = function(user) {
            return this.http.put(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].apiUrl + '/users/' + user._id, user);
          };
          UserService.prototype.delete = function(id) {
            return this.http.delete(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].apiUrl + '/users/' + id);
          };
          UserService = __decorate([
            Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
            __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]])
          ], UserService);
          return UserService;
        }());



        /***/
      }),

    /***/
    "./src/app/app.component.css":
      /*!***********************************!*\
        !*** ./src/app/app.component.css ***!
        \***********************************/
      /*! no static exports found */
      /***/
      (function(module, exports) {

        module.exports = ".main{\n  /*min-height: 95vh;*/\n  padding-top: 90px;\n  padding-bottom: 3vh;\n  min-height:92vh;\n}\n"

        /***/
      }),

    /***/
    "./src/app/app.component.html":
      /*!************************************!*\
        !*** ./src/app/app.component.html ***!
        \************************************/
      /*! no static exports found */
      /***/
      (function(module, exports) {

        module.exports = "<app-menu></app-menu>\n\n<!-- main app container -->\n<div class=\"container main\">\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <alert></alert>\n      <router-outlet></router-outlet>\n    </div>\n  </div>\n</div>\n\n<app-footer></app-footer>\n"

        /***/
      }),

    /***/
    "./src/app/app.component.ts":
      /*!**********************************!*\
        !*** ./src/app/app.component.ts ***!
        \**********************************/
      /*! exports provided: AppComponent */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
        /* harmony import */
        var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
        var __decorate = (undefined && undefined.__decorate) || function(decorators, target, key, desc) {
          var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
          if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
          else
            for (var i = decorators.length - 1; i >= 0; i--)
              if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
          return c > 3 && r && Object.defineProperty(target, key, r), r;
        };

        var AppComponent = /** @class */ (function() {
          function AppComponent() {}
          AppComponent = __decorate([
            Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
              selector: 'app',
              template: __webpack_require__( /*! ./app.component.html */ "./src/app/app.component.html"),
              styles: [__webpack_require__( /*! ./app.component.css */ "./src/app/app.component.css")]
            })
          ], AppComponent);
          return AppComponent;
        }());



        /***/
      }),

    /***/
    "./src/app/app.module.ts":
      /*!*******************************!*\
        !*** ./src/app/app.module.ts ***!
        \*******************************/
      /*! exports provided: AppModule */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
        /* harmony import */
        var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
        /* harmony import */
        var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
        /* harmony import */
        var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
        /* harmony import */
        var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__( /*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
        /* harmony import */
        var _app_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__( /*! ./app.component */ "./src/app/app.component.ts");
        /* harmony import */
        var _app_routing__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__( /*! ./app.routing */ "./src/app/app.routing.ts");
        /* harmony import */
        var _directives__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__( /*! ./_directives */ "./src/app/_directives/index.ts");
        /* harmony import */
        var _guards__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__( /*! ./_guards */ "./src/app/_guards/index.ts");
        /* harmony import */
        var _helpers__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__( /*! ./_helpers */ "./src/app/_helpers/index.ts");
        /* harmony import */
        var _services__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__( /*! ./_services */ "./src/app/_services/index.ts");
        /* harmony import */
        var _components_users__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__( /*! ./_components/users */ "./src/app/_components/users/index.ts");
        /* harmony import */
        var _components_login__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__( /*! ./_components/login */ "./src/app/_components/login/index.ts");
        /* harmony import */
        var _services_menu_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__( /*! ./_services/menu.service */ "./src/app/_services/menu.service.ts");
        /* harmony import */
        var _components_menu_menu_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__( /*! ./_components/menu/menu.component */ "./src/app/_components/menu/menu.component.ts");
        /* harmony import */
        var _components_footer_footer_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__( /*! ./_components/footer/footer.component */ "./src/app/_components/footer/footer.component.ts");
        /* harmony import */
        var _components_home_home_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__( /*! ./_components/home/home.component */ "./src/app/_components/home/home.component.ts");
        /* harmony import */
        var _components_stations_stations_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__( /*! ./_components/stations/stations.component */ "./src/app/_components/stations/stations.component.ts");
        /* harmony import */
        var _components_admin_panel_admin_panel_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__( /*! ./_components/admin-panel/admin-panel.component */ "./src/app/_components/admin-panel/admin-panel.component.ts");
        /* harmony import */
        var _components_login_reset_password_reset_password_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__( /*! ./_components/login/reset-password/reset-password.component */ "./src/app/_components/login/reset-password/reset-password.component.ts");
        /* harmony import */
        var _components_faq_faq_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__( /*! ./_components/faq/faq.component */ "./src/app/_components/faq/faq.component.ts");
        /* harmony import */
        var _services_stations_service__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__( /*! ./_services/stations.service */ "./src/app/_services/stations.service.ts");
        /* harmony import */
        var _components_stations_add_station_modal_add_station_modal_component__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__( /*! ./_components/stations/add-station-modal/add-station-modal.component */ "./src/app/_components/stations/add-station-modal/add-station-modal.component.ts");
        /* harmony import */
        var _components_stations_delete_station_modal_delete_station_modal_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__( /*! ./_components/stations/delete-station-modal/delete-station-modal.component */ "./src/app/_components/stations/delete-station-modal/delete-station-modal.component.ts");
        /* harmony import */
        var _components_stations_update_sation_modal_update_sation_modal_component__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__( /*! ./_components/stations/update-sation-modal/update-sation-modal.component */ "./src/app/_components/stations/update-sation-modal/update-sation-modal.component.ts");
        /* harmony import */
        var _components_login_askreset_askreset_component__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__( /*! ./_components/login/askreset/askreset.component */ "./src/app/_components/login/askreset/askreset.component.ts");
        /* harmony import */
        var ngx_toastr__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__( /*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
        /* harmony import */
        var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__( /*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm5/animations.js");
        /* harmony import */
        var _components_admin_panel_refuse_user_modal_refuse_user_modal_component__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__( /*! ./_components/admin-panel/refuse-user-modal/refuse-user-modal.component */ "./src/app/_components/admin-panel/refuse-user-modal/refuse-user-modal.component.ts");
        var __decorate = (undefined && undefined.__decorate) || function(decorators, target, key, desc) {
          var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
          if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
          else
            for (var i = decorators.length - 1; i >= 0; i--)
              if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
          return c > 3 && r && Object.defineProperty(target, key, r), r;
        };





        // used to create fake backend









        ;


        ;

        ;



        ;

        var AppModule = /** @class */ (function() {
          function AppModule() {}
          AppModule = __decorate([
            Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
              imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ReactiveFormsModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClientModule"],
                _app_routing__WEBPACK_IMPORTED_MODULE_5__["routing"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_26__["BrowserAnimationsModule"],
                ngx_toastr__WEBPACK_IMPORTED_MODULE_25__["ToastrModule"].forRoot()
              ],
              declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"],
                _directives__WEBPACK_IMPORTED_MODULE_6__["AlertComponent"],
                _components_users__WEBPACK_IMPORTED_MODULE_10__["UsersComponent"],
                _components_login__WEBPACK_IMPORTED_MODULE_11__["LoginComponent"],
                _components_menu_menu_component__WEBPACK_IMPORTED_MODULE_13__["MenuComponent"],
                _components_footer_footer_component__WEBPACK_IMPORTED_MODULE_14__["FooterComponent"],
                _components_home_home_component__WEBPACK_IMPORTED_MODULE_15__["HomeComponent"],
                _components_stations_stations_component__WEBPACK_IMPORTED_MODULE_16__["StationsComponent"],
                _components_admin_panel_admin_panel_component__WEBPACK_IMPORTED_MODULE_17__["AdminPanelComponent"],
                _components_login_reset_password_reset_password_component__WEBPACK_IMPORTED_MODULE_18__["ResetPasswordComponent"],
                _components_faq_faq_component__WEBPACK_IMPORTED_MODULE_19__["FaqComponent"],
                _components_stations_add_station_modal_add_station_modal_component__WEBPACK_IMPORTED_MODULE_21__["AddStationModalComponent"],
                _components_stations_delete_station_modal_delete_station_modal_component__WEBPACK_IMPORTED_MODULE_22__["DeleteStationModalComponent"],
                _components_stations_update_sation_modal_update_sation_modal_component__WEBPACK_IMPORTED_MODULE_23__["UpdateSationModalComponent"],
                _components_login_askreset_askreset_component__WEBPACK_IMPORTED_MODULE_24__["AskresetComponent"],
                _components_admin_panel_refuse_user_modal_refuse_user_modal_component__WEBPACK_IMPORTED_MODULE_27__["RefuseUserModalComponent"]
              ],
              providers: [
                _guards__WEBPACK_IMPORTED_MODULE_7__["AuthGuard"],
                _services__WEBPACK_IMPORTED_MODULE_9__["AlertService"],
                _services__WEBPACK_IMPORTED_MODULE_9__["AuthenticationService"],
                _services__WEBPACK_IMPORTED_MODULE_9__["UserService"],
                _services_stations_service__WEBPACK_IMPORTED_MODULE_20__["StationsService"],
                { provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HTTP_INTERCEPTORS"], useClass: _helpers__WEBPACK_IMPORTED_MODULE_8__["JwtInterceptor"], multi: true },
                { provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HTTP_INTERCEPTORS"], useClass: _helpers__WEBPACK_IMPORTED_MODULE_8__["ErrorInterceptor"], multi: true },
                _services_menu_service__WEBPACK_IMPORTED_MODULE_12__["MenuService"]
              ],
              bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"]]
            })
          ], AppModule);
          return AppModule;
        }());



        /***/
      }),

    /***/
    "./src/app/app.routing.ts":
      /*!********************************!*\
        !*** ./src/app/app.routing.ts ***!
        \********************************/
      /*! exports provided: routing */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "routing", function() { return routing; });
        /* harmony import */
        var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
        /* harmony import */
        var _components_users__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ./_components/users */ "./src/app/_components/users/index.ts");
        /* harmony import */
        var _components_login__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! ./_components/login */ "./src/app/_components/login/index.ts");
        /* harmony import */
        var _guards__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__( /*! ./_guards */ "./src/app/_guards/index.ts");
        /* harmony import */
        var _components_home_home_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__( /*! ./_components/home/home.component */ "./src/app/_components/home/home.component.ts");
        /* harmony import */
        var _components_admin_panel_admin_panel_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__( /*! ./_components/admin-panel/admin-panel.component */ "./src/app/_components/admin-panel/admin-panel.component.ts");
        /* harmony import */
        var _components_stations_stations_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__( /*! ./_components/stations/stations.component */ "./src/app/_components/stations/stations.component.ts");
        /* harmony import */
        var _components_login_reset_password_reset_password_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__( /*! ./_components/login/reset-password/reset-password.component */ "./src/app/_components/login/reset-password/reset-password.component.ts");
        /* harmony import */
        var _components_faq_faq_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__( /*! ./_components/faq/faq.component */ "./src/app/_components/faq/faq.component.ts");
        /* harmony import */
        var _components_login_askreset_askreset_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__( /*! ./_components/login/askreset/askreset.component */ "./src/app/_components/login/askreset/askreset.component.ts");









        var appRoutes = [
          { path: '', component: _components_home_home_component__WEBPACK_IMPORTED_MODULE_4__["HomeComponent"] },
          { path: 'admin', component: _components_admin_panel_admin_panel_component__WEBPACK_IMPORTED_MODULE_5__["AdminPanelComponent"], canActivate: [_guards__WEBPACK_IMPORTED_MODULE_3__["AuthGuard"]] },
          { path: 'stations', component: _components_stations_stations_component__WEBPACK_IMPORTED_MODULE_6__["StationsComponent"], canActivate: [_guards__WEBPACK_IMPORTED_MODULE_3__["AuthGuard"]] },
          { path: 'users', component: _components_users__WEBPACK_IMPORTED_MODULE_1__["UsersComponent"], canActivate: [_guards__WEBPACK_IMPORTED_MODULE_3__["AuthGuard"]] },
          { path: 'login', component: _components_login__WEBPACK_IMPORTED_MODULE_2__["LoginComponent"] },
          { path: 'login/reset', component: _components_login_reset_password_reset_password_component__WEBPACK_IMPORTED_MODULE_7__["ResetPasswordComponent"] },
          { path: 'login/askreset', component: _components_login_askreset_askreset_component__WEBPACK_IMPORTED_MODULE_9__["AskresetComponent"] },
          { path: 'faq', component: _components_faq_faq_component__WEBPACK_IMPORTED_MODULE_8__["FaqComponent"] },
          // otherwise redirect to home
          { path: '**', redirectTo: '' }
        ];
        var routing = _angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"].forRoot(appRoutes);


        /***/
      }),

    /***/
    "./src/environments/environment.ts":
      /*!*****************************************!*\
        !*** ./src/environments/environment.ts ***!
        \*****************************************/
      /*! exports provided: environment */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
        // This file can be replaced during build by using the `fileReplacements` array.
        // `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
        // The list of file replacements can be found in `angular.json`.
        var environment = {
          production: false,
          apiUrl: 'http://localhost:3000/api'
        };
        /*
         * In development mode, to ignore zone related error stack frames such as
         * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
         * import the following file, but please comment it out in production mode
         * because it will have performance impact when throw error
         */
        // import 'zone.js/dist/zone-error';  // Included with Angular CLI.


        /***/
      }),

    /***/
    "./src/main.ts":
      /*!*********************!*\
        !*** ./src/main.ts ***!
        \*********************/
      /*! no exports provided */
      /***/
      (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony import */
        var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
        /* harmony import */
        var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
        /* harmony import */
        var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! ./app/app.module */ "./src/app/app.module.ts");
        /* harmony import */
        var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__( /*! ./environments/environment */ "./src/environments/environment.ts");




        if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
          Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
        }
        Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
          .catch(function(err) { return console.log(err); });


        /***/
      }),

    /***/
    0:
      /*!***************************!*\
        !*** multi ./src/main.ts ***!
        \***************************/
      /*! no static exports found */
      /***/
      (function(module, exports, __webpack_require__) {

        module.exports = __webpack_require__( /*! /home/dorian/workspace/TFE4Haiti/client/src/main.ts */ "./src/main.ts");


        /***/
      })

  },
  [
    [0, "runtime", "vendor"]
  ]
]);
//# sourceMappingURL=main.js.map