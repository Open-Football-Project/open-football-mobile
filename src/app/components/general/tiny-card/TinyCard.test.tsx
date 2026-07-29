import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import TinyCard from './TinyCard';

describe('TinyCard', () => {
  it('renders the title when provided', () => {
    render(
      <TinyCard
        title="Card Title"
        sections={[{ label: 'Section 1', component: <Text>Content 1</Text> }]}
      />
    );

    const title = screen.getByTestId('tiny-card-title');
    expect(title).toBeTruthy();
    expect(title.props.children).toBe('Card Title');
  });

  it('does not render a title when no title is passed', () => {
    render(
      <TinyCard
        sections={[{ label: 'Section 1', component: <Text>Content 1</Text> }]}
      />
    );

    const title = screen.queryByTestId('tiny-card-title');
    expect(title).toBeNull();
  });

  it('renders all section labels and components', () => {
    render(
      <TinyCard
        sections={[
          { label: 'First Label', component: <Text>First Content</Text> },
          { label: 'Second Label', component: <Text>Second Content</Text> },
        ]}
      />
    );

    expect(screen.getByText('First Label')).toBeTruthy();
    expect(screen.getByText('First Content')).toBeTruthy();
    expect(screen.getByText('Second Label')).toBeTruthy();
    expect(screen.getByText('Second Content')).toBeTruthy();
  });

  it('renders section component even if label is missing', () => {
    render(
      <TinyCard sections={[{ component: <Text>No Label Content</Text> }]} />
    );

    expect(screen.getByText('No Label Content')).toBeTruthy();
  });

  it('renders with custom cardId', () => {
    render(
      <TinyCard
        cardId="custom-card-id"
        sections={[{ label: 'Section 1', component: <Text>Content</Text> }]}
      />
    );

    const card = screen.getByTestId('custom-card-id');
    expect(card).toBeTruthy();
  });

  it('renders default cardId when not provided', () => {
    render(
      <TinyCard
        sections={[{ label: 'Section 1', component: <Text>Content</Text> }]}
      />
    );

    const card = screen.getByTestId('tiny-card');
    expect(card).toBeTruthy();
  });
});
