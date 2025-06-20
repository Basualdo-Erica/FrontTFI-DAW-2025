'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">daw-integrador documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/EncuestaModule.html" data-type="entity-link" >EncuestaModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-EncuestaModule-318afcbcc1dd6dccd874d8a1af77cce2916d6b3c65a1e8354d774738b5d6eff845f859bec04dbc21e90b93865a41b3c590475f7933b9ff5c03b389e4d0974974"' : 'data-bs-target="#xs-controllers-links-module-EncuestaModule-318afcbcc1dd6dccd874d8a1af77cce2916d6b3c65a1e8354d774738b5d6eff845f859bec04dbc21e90b93865a41b3c590475f7933b9ff5c03b389e4d0974974"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-EncuestaModule-318afcbcc1dd6dccd874d8a1af77cce2916d6b3c65a1e8354d774738b5d6eff845f859bec04dbc21e90b93865a41b3c590475f7933b9ff5c03b389e4d0974974"' :
                                            'id="xs-controllers-links-module-EncuestaModule-318afcbcc1dd6dccd874d8a1af77cce2916d6b3c65a1e8354d774738b5d6eff845f859bec04dbc21e90b93865a41b3c590475f7933b9ff5c03b389e4d0974974"' }>
                                            <li class="link">
                                                <a href="controllers/EncuestasController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EncuestasController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-EncuestaModule-318afcbcc1dd6dccd874d8a1af77cce2916d6b3c65a1e8354d774738b5d6eff845f859bec04dbc21e90b93865a41b3c590475f7933b9ff5c03b389e4d0974974"' : 'data-bs-target="#xs-injectables-links-module-EncuestaModule-318afcbcc1dd6dccd874d8a1af77cce2916d6b3c65a1e8354d774738b5d6eff845f859bec04dbc21e90b93865a41b3c590475f7933b9ff5c03b389e4d0974974"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-EncuestaModule-318afcbcc1dd6dccd874d8a1af77cce2916d6b3c65a1e8354d774738b5d6eff845f859bec04dbc21e90b93865a41b3c590475f7933b9ff5c03b389e4d0974974"' :
                                        'id="xs-injectables-links-module-EncuestaModule-318afcbcc1dd6dccd874d8a1af77cce2916d6b3c65a1e8354d774738b5d6eff845f859bec04dbc21e90b93865a41b3c590475f7933b9ff5c03b389e4d0974974"' }>
                                        <li class="link">
                                            <a href="injectables/EncuestasService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EncuestasService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/EncuestasController.html" data-type="entity-link" >EncuestasController</a>
                                </li>
                            </ul>
                        </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/EncuestasService.html" data-type="entity-link" >EncuestasService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});