import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import TipTapRenderer from '@/components/TipTapRenderer';

function makeDoc(content: object[]) {
  return JSON.stringify({ type: 'doc', content });
}

function text(t: string, marks?: { type: string }[]) {
  return marks ? { type: 'text', text: t, marks } : { type: 'text', text: t };
}

describe('TipTapRenderer', () => {
  it('renders plain text in a paragraph', () => {
    render(
      <TipTapRenderer contentJson={makeDoc([{ type: 'paragraph', content: [text('Hello')] }])} />,
    );
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders bold text as <strong>', () => {
    render(
      <TipTapRenderer
        contentJson={makeDoc([{ type: 'paragraph', content: [text('Bold', [{ type: 'bold' }])] }])}
      />,
    );
    expect(screen.getByText('Bold').tagName).toBe('STRONG');
  });

  it('renders italic text as <em>', () => {
    render(
      <TipTapRenderer
        contentJson={makeDoc([
          { type: 'paragraph', content: [text('Italic', [{ type: 'italic' }])] },
        ])}
      />,
    );
    expect(screen.getByText('Italic').tagName).toBe('EM');
  });

  it('renders code mark as <code>', () => {
    render(
      <TipTapRenderer
        contentJson={makeDoc([
          { type: 'paragraph', content: [text('inline', [{ type: 'code' }])] },
        ])}
      />,
    );
    expect(screen.getByText('inline').tagName).toBe('CODE');
  });

  it('renders h1 heading', () => {
    render(
      <TipTapRenderer
        contentJson={makeDoc([{ type: 'heading', attrs: { level: 1 }, content: [text('Title')] }])}
      />,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Title' })).toBeInTheDocument();
  });

  it('renders h2 heading', () => {
    render(
      <TipTapRenderer
        contentJson={makeDoc([
          { type: 'heading', attrs: { level: 2 }, content: [text('Section')] },
        ])}
      />,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Section' })).toBeInTheDocument();
  });

  it('renders h3 heading', () => {
    render(
      <TipTapRenderer
        contentJson={makeDoc([{ type: 'heading', attrs: { level: 3 }, content: [text('Sub')] }])}
      />,
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Sub' })).toBeInTheDocument();
  });

  it('renders bullet list', () => {
    const { container } = render(
      <TipTapRenderer
        contentJson={makeDoc([
          {
            type: 'bulletList',
            content: [{ type: 'listItem', content: [text('Item')] }],
          },
        ])}
      />,
    );
    expect(container.querySelector('ul')).toBeInTheDocument();
    expect(screen.getByText('Item')).toBeInTheDocument();
  });

  it('renders ordered list', () => {
    const { container } = render(
      <TipTapRenderer
        contentJson={makeDoc([
          {
            type: 'orderedList',
            content: [{ type: 'listItem', content: [text('First')] }],
          },
        ])}
      />,
    );
    expect(container.querySelector('ol')).toBeInTheDocument();
    expect(screen.getByText('First')).toBeInTheDocument();
  });

  it('renders code block as <pre><code>', () => {
    const { container } = render(
      <TipTapRenderer
        contentJson={makeDoc([{ type: 'codeBlock', content: [text('const x = 1')] }])}
      />,
    );
    expect(container.querySelector('pre')).toBeInTheDocument();
    expect(container.querySelector('pre code')).toBeInTheDocument();
    expect(screen.getByText('const x = 1')).toBeInTheDocument();
  });

  it('renders horizontal rule as <hr>', () => {
    const { container } = render(
      <TipTapRenderer contentJson={makeDoc([{ type: 'horizontalRule' }])} />,
    );
    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  it('shows error message on invalid JSON', () => {
    render(<TipTapRenderer contentJson='not-valid-json' />);
    expect(screen.getByText(/could not render/i)).toBeInTheDocument();
  });

  it('renders without crashing when doc has no content', () => {
    const { container } = render(<TipTapRenderer contentJson={JSON.stringify({ type: 'doc' })} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
