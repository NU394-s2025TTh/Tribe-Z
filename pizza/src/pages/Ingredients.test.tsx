/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
// filepath: /Users/azb/Documents/code/394/Tribe-Z/pizza/src/pages/Ingredients.test.tsx
// run with npx nx test pizza

import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import Ingredients from './Ingredients';

// Mock Firebase modules
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn(),
}));

vi.mock('@/lib/firebase', () => ({
  db: {},
  app: {},
}));

vi.mock('../lib/function/cartFunctions', () => ({
  fetchCart: vi.fn(),
  updateCart: vi.fn(),
}));

vi.mock('@/components/sections/IngredientCard', () => ({
  default: ({
    name,
    onAddToCart,
  }: {
    name: string;
    onAddToCart: () => void;
  }) => (
    <div data-testid={`ingredient-${name}`}>
      <span>{name}</span>
      <button onClick={onAddToCart}>Add to Cart</button>
    </div>
  ),
}));

vi.mock('@/components/ui/input', () => ({
  Input: ({
    placeholder,
    value,
    onChange,
    ...props
  }: {
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    [key: string]: unknown;
  }) => (
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      data-testid="search-input"
      {...props}
    />
  ),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    variant,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: string;
    [key: string]: unknown;
  }) => (
    <button
      onClick={onClick}
      data-testid={`category-${children}`}
      data-variant={variant}
      {...props}
    >
      {children}
    </button>
  ),
}));

describe('Ingredients Component', () => {
  const mockIngredients = [
    {
      id: '1',
      name: 'Mozzarella Cheese',
      type: { category: 'Cheese', description: 'Fresh mozzarella' },
      price: '$5.99',
      brand: 'Brand A',
      packageSize: '8oz',
      productImage: 'image1.jpg',
    },
    {
      id: '2',
      name: 'Tomato Sauce',
      type: { category: 'Sauce', description: 'Premium tomato sauce' },
      price: '$3.99',
      brand: 'Brand B',
      packageSize: '12oz',
      productImage: 'image2.jpg',
    },
    {
      id: '3',
      name: 'Flour',
      type: { category: 'Flour', description: 'All-purpose flour' },
      price: '$2.99',
      brand: 'Brand C',
      packageSize: '5lbs',
      productImage: 'image3.jpg',
    },
  ];

  beforeEach(async () => {
    const { getDocs } = vi.mocked(await import('firebase/firestore'));
    const { getAuth, onAuthStateChanged } = vi.mocked(
      await import('firebase/auth')
    );
    const { fetchCart, updateCart } = vi.mocked(
      await import('../lib/function/cartFunctions')
    );

    getDocs.mockResolvedValue({
      docs: mockIngredients.map((ing) => ({
        id: ing.id,
        data: () => ing,
      })),
      metadata: { fromCache: false, hasPendingWrites: false },
      size: mockIngredients.length,
      empty: mockIngredients.length === 0,
      query: {} as any,
      docChanges: () => [],
      forEach: () => {},
    } as any);

    getAuth.mockReturnValue({
      currentUser: { uid: 'test-user' },
    } as ReturnType<typeof getAuth>);

    onAuthStateChanged.mockImplementation((auth, callback) => {
      if (typeof callback === 'function') {
        callback({ uid: 'test-user' } as Parameters<typeof callback>[0]);
      }
      return () => {
        /* unsubscribe function */
      };
    });

    // Mock fetchCart to return a proper cart structure
    fetchCart.mockResolvedValue({
      cart: {
        items: [],
      },
    });

    // Mock updateCart to return void (as it should based on the error)
    updateCart.mockResolvedValue(undefined);
  });

  test('filters ingredients by category when category button is clicked', async () => {
    render(<Ingredients />);

    await waitFor(() => {
      expect(
        screen.getByTestId('ingredient-Mozzarella Cheese')
      ).toBeInTheDocument();
    });

    const cheeseButton = screen.getByTestId('category-Cheese');
    fireEvent.click(cheeseButton);

    await waitFor(() => {
      expect(
        screen.getByTestId('ingredient-Mozzarella Cheese')
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('ingredient-Tomato Sauce')
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('ingredient-Flour')).not.toBeInTheDocument();
    });
  });

  test('shows ingredient when searching for existing ingredient', async () => {
    render(<Ingredients />);

    await waitFor(() => {
      expect(
        screen.getByTestId('ingredient-Mozzarella Cheese')
      ).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'mozzarella' } });

    await waitFor(() => {
      expect(
        screen.getByTestId('ingredient-Mozzarella Cheese')
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('ingredient-Tomato Sauce')
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('ingredient-Flour')).not.toBeInTheDocument();
    });
  });

  test('shows no ingredients when searching for non-existent ingredient', async () => {
    render(<Ingredients />);

    await waitFor(() => {
      expect(
        screen.getByTestId('ingredient-Mozzarella Cheese')
      ).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    await waitFor(() => {
      expect(
        screen.queryByTestId('ingredient-Mozzarella Cheese')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('ingredient-Tomato Sauce')
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('ingredient-Flour')).not.toBeInTheDocument();
    });
  });
  test('does not show ingredients when user is logged out', async () => {
  // Mock getAuth to return no user
  const { getAuth } = vi.mocked(await import('firebase/auth'));
  getAuth.mockReturnValue({ currentUser: null } as any);

  // Mock onAuthStateChanged to call back with null (logged out)
  const { onAuthStateChanged } = vi.mocked(await import('firebase/auth'));
  onAuthStateChanged.mockImplementation((auth, callback) => {
    if (typeof callback === 'function') {
      callback(null);
    }
    return () => {};
  });

  render(<Ingredients />);

  await waitFor(() => {
    expect(screen.queryByTestId('ingredient-Mozzarella Cheese')).not.toBeInTheDocument();
    expect(screen.queryByTestId('ingredient-Tomato Sauce')).not.toBeInTheDocument();
    expect(screen.queryByTestId('ingredient-Flour')).not.toBeInTheDocument();
    expect(screen.getByText(/please log in to view and manage your cart/i)).toBeInTheDocument();
  });
});

test('shows ingredients when user is logged in', async () => {
  render(<Ingredients />);

  // Wait for the ingredients to appear
  await waitFor(() => {
    expect(screen.getByTestId('ingredient-Mozzarella Cheese')).toBeInTheDocument();
    expect(screen.getByTestId('ingredient-Tomato Sauce')).toBeInTheDocument();
    expect(screen.getByTestId('ingredient-Flour')).toBeInTheDocument();
  });
});
});
