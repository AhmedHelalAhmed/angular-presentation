import {
  AfterViewInit,
  Component,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MonacoConfigService } from '../../../../exercise/services/monaco-config.service';

declare const monaco: any;
declare const require: any;


@Component({
  selector: 'slides-simple-editor',
  template: `
    <div #editor class="monaco-editor"></div>`,
  styleUrls: ['editor.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SimpleEditorComponent),
      multi: true
    }
  ],
})
export class SimpleEditorComponent implements ControlValueAccessor, AfterViewInit, OnChanges {
  height: number;
  minLines = 6;
  actialFontSize: number;
  model: any;
  editor: any;
  @Input() fontSize = 12;
  @Input() language = 'html';
  @Input() lineNumbers = true;
  @Output() change = new EventEmitter();
  @ViewChild('editor') editorEl;
  private code: string;

  constructor(readonly monacoConfigService: MonacoConfigService) {
  }


  registerOnTouched(fn: any): void {
  }

  registerOnChange(onChange: (code: string) => void): void {
    this.change.subscribe(onChange)
  }

  writeValue(value: string): void {
    if (value === null) {
      return;
    }
    this.code = value;
    if (this.model) {
      this.model.setValue(value);
    }
  }

  @HostListener('window:resize')
  resize() {
    if (this.editor) {
      this.editor.updateOptions({fontSize: this.fontSize * document.documentElement.clientWidth / 1800});
      const lines = this.code.split('\n').length;
      const lineHeight = this.actialFontSize * 1.6;
      const height = Math.max(lines * lineHeight, lineHeight * this.minLines);

      if (this.height !== height) {
        this.height = height;
        this.editorEl.nativeElement.style.height = height + 'px';
        this.editor.layout();
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.fontSize) {
      this.resize();
    }
  }


  ngAfterViewInit(): void {
    const editor = this.editorEl.nativeElement;
    this.model = this.monacoConfigService.monaco.editor.createModel(this.code, this.language);
    this.editor = this.monacoConfigService.monaco.editor.create(editor,
      {
        model: this.model,
        scrollBeyondLastLine: false,
        tabCompletion: true,
        wordBasedSuggestions: true,
        lineNumbersMinChars: 3,
        lineNumbers: this.lineNumbers,
        automaticLayout: true,
        fontSize: this.fontSize,
        folding: true,
        minimap: {
          enabled: false
        }
      });

    this.model.onDidChangeContent(() => {
      this.change.emit(this.editor.getModel().getValue());
    });


    this.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      () => this.change.emit(this.editor.getModel().getValue()));


  }
}

