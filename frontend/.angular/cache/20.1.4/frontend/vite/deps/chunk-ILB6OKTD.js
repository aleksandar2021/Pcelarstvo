import {
  MatRipple
} from "./chunk-BD7OLDQC.js";
import {
  MatCommonModule
} from "./chunk-WMUHVMJU.js";
import {
  NgModule,
  setClassMetadata,
  ɵɵdefineInjector,
  ɵɵdefineNgModule
} from "./chunk-XI3T76QP.js";

// node_modules/@angular/material/fesm2022/index-BRImSAOu.mjs
var MatRippleModule = class _MatRippleModule {
  static ɵfac = function MatRippleModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatRippleModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _MatRippleModule,
    imports: [MatCommonModule, MatRipple],
    exports: [MatRipple, MatCommonModule]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [MatCommonModule, MatCommonModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatRippleModule, [{
    type: NgModule,
    args: [{
      imports: [MatCommonModule, MatRipple],
      exports: [MatRipple, MatCommonModule]
    }]
  }], null, null);
})();

export {
  MatRippleModule
};
//# sourceMappingURL=chunk-ILB6OKTD.js.map
