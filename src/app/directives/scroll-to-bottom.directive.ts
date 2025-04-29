import { Directive, ElementRef, AfterViewChecked, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[scrollToBottom]',
  standalone: true,
})
export class ScrollToBottomDirective implements AfterViewChecked, OnChanges {
  @Input() triggerScrollToBottom: any; // Use this to trigger scroll on input change

  private shouldScroll = true;

  constructor(private el: ElementRef) {}

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Scroll when input changes (typically when new messages arrive)
    if (changes['triggerScrollToBottom']) {
      this.shouldScroll = true;
    }

    // Handle scrollToBottom input
    if (this.scrollToBottom) {
      this.el.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // private scrollToBottom(): void {
  //   try {
  //     this.el.nativeElement.scrollTop = this.el.nativeElement.scrollHeight;
  //   } catch (err) {}
  // }
  @Input() scrollToBottom: any;
}