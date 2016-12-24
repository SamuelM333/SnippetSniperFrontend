import { Component, ViewChild, AfterViewInit, EventEmitter, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MaterializeAction } from 'angular2-materialize';
import { DragulaService } from 'ng2-dragula/ng2-dragula';

import { ApiService } from '../../api.service';

import { Snippet, Fragment } from '../snippet';
import { User } from '../../profile/user';

declare const $: any;
declare const ace: any;
declare const Materialize: any;


@Component({
    selector: 'app-snippet-editor',
    templateUrl: './snippet-editor.component.html',
    styleUrls: ['./snippet-editor.component.sass']
})
export class SnippetEditorComponent implements AfterViewInit, OnDestroy {

    @ViewChild('editor') editor;
    @ViewChild('fragment_select') fragment_select;
    modalActions = new EventEmitter<string|MaterializeAction>();
    submitModal = new EventEmitter<string|MaterializeAction>();

    shared = 'public';
    email: string = '';
    allowed_users: User[] = [];
    title: string = '';
    text: string = 'function foo(items) {\n\tvar x = \'All this is syntax highlighted\';\n\treturn x;\n}';

    fragments: Array<Fragment> = [];

    languages = [
        { language: 'Javascript', editorLanguage: 'javascript', icon: 'assets/svg/js.svg' },
        { language: 'Python', editorLanguage: 'python', icon: 'assets/svg/python.svg' },
        { language: 'C++', editorLanguage: 'c_cpp', icon: 'assets/svg/c++.svg' },
        { language: 'Markdown', editorLanguage: 'markdown', icon: 'assets/svg/markdown.svg' },
    ];

    selectedLanguage = this.languages[0];

    constructor(private apiService: ApiService, private dragulaService: DragulaService) {
        dragulaService.setOptions('fragments-list', {
            moves: function (el, container, handle) {
                return handle.className === 'material-icons fragment-icons';
            }
        });
    }

    ngAfterViewInit() {
        ace.config.set('basePath', 'assets/ace');
        this.editor.setTheme('monokai');
        this.editor.setMode('javascript');
        this.editor.getEditor().setShowPrintMargin(false);
        this.editor.getEditor().setAutoScrollEditorIntoView(true);

        setTimeout(this.onResize, 100);
        $('.tooltipped').tooltip({ delay: 50 });
        this.onResize();
    }

    ngOnDestroy() { this.dragulaService.destroy('fragments-list'); }

    onResize() {
        let topHeight: number = $('#nav').outerHeight() + $('#snippet-container').outerHeight();
        let footerHeight: number = $('#footer').outerHeight();
        let windowHeight: number = $(window).outerHeight();

        $('#editor').height(windowHeight - topHeight - footerHeight - 1);
    }

    addFragment() {
        let editorText: string = this.editor.getEditor().getValue();
        let toastMessage = 'Fragment added';

        if (editorText !== '') {
            this.fragments.push(
                new Fragment(this.selectedLanguage.language,
                    this.selectedLanguage.editorLanguage,
                    editorText)
            );
            this.editor.getEditor().setValue('');
        } else { toastMessage = 'Empty fragment'; }

        Materialize.toast(toastMessage, 4000);
    }

    openFragment(index: number) {
        this.selectedLanguage = this.languages[this.languages.findIndex(
            x => x.editorLanguage === this.fragments[index].editorLanguage)];

        this.changeEditorLanguage(this.selectedLanguage.editorLanguage);
        this.editor.getEditor().setValue(this.fragments[index].body);
        this.fragment_select.nativeElement.value = this.selectedLanguage.language;

        this.closeModal();
    }

    submitSnippet(form: NgForm) {
        let authUser = JSON.parse(localStorage.getItem('authUser'));
        console.log(authUser.id);

        authUser = new User(
            authUser.id,
            authUser.name,
            authUser.last_name,
            authUser.email,
            authUser.admin,
        );

        let snippet = new Snippet(
            null,
            parseInt(authUser.id),
            form.value.snippet_title,
            new Date().toISOString().slice(0, 19).replace('T', ' '),
            this.fragments
        );

        if (this.shared === 'public') {
            this.allowed_users = [];
        } else if (this.shared === 'private') {
            this.allowed_users = [authUser];
        } else {
            this.allowed_users.push(authUser);
        }

        console.log(authUser.id);
        console.log(snippet);

        this.apiService.submitSnippet(snippet, this.allowed_users).subscribe(
            data => {
                if (data._status === 'OK') {
                    // Redirect to snippet view
                    console.log(data);
                } else { console.log('Error'); }
            }
        );
    }

    changeEditorLanguage(language) {
        this.selectedLanguage = this.languages[this.languages.findIndex(
            x => x.editorLanguage === language)];
        this.editor.setMode(language);
    }

    addUser() {
        if (this.email !== '') {
            this.apiService.getUserByEmail(this.email).subscribe(
                data => {
                    // Check if not the current user
                    let authUser = JSON.parse(localStorage.getItem('authUser'));

                    if (authUser.email !== this.email) {
                        let obtained_user = new User(
                            data.id,
                            data.name,
                            data.last_name,
                            data.email,
                            data.admin
                        );

                        // Check if user is not already added
                        if (this.allowed_users.findIndex(x => x.email === this.email) === -1) {
                            this.allowed_users.push(obtained_user);
                            Materialize.toast('Person added', 4000);
                            this.email = '';
                        } else { Materialize.toast('Person already added', 4000); }
                    } else { Materialize.toast('Can\'t add yourself', 4000); }
                },
                error => {
                    Materialize.toast('User not found', 4000);
                }
            );
        } else { Materialize.toast('Empty Email', 4000); }
    }

    removeFromAllowedUsers(index: number) { this.allowed_users.splice(index, 1); }

    openFragmentListModal() { this.modalActions.emit({ action: 'modal', params: ['open'] }); }

    openSubmitModal() { this.submitModal.emit({ action: 'modal', params: ['open'] }); }

    closeModal() { this.modalActions.emit({ action: 'modal', params: ['close'] }); }
}
