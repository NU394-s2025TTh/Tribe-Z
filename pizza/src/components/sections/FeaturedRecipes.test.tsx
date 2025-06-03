import { render, screen } from '@testing-library/react';
import FeaturedRecipes from './FeaturedRecipes';

describe('FeaturedRecipes Component', () => {
  describe('Marketing Header', () => {
    it('should render the marketing header with the correct title', () => {
      render(<FeaturedRecipes />);
      const headerTitle = screen.getByRole('heading', {
        name: /DoughJo: Your One-Stop Shop for Crafting World-Class Pizza at Home/i,
      });
      expect(headerTitle).toBeInTheDocument();
    });

    it('should render the marketing header with the correct description', () => {
      render(<FeaturedRecipes />);
      const headerDescription = screen.getByText(
        "Giving home pizza makers everything they need to effortlessly create delicious pizza right from their own kitchen. Fresh ingredients, high-quality equipment, and a helpful chatbot are just a click away!"
      );
      expect(headerDescription).toBeInTheDocument();
    });

    it('should apply the correct styling to the marketing header', () => {
      render(<FeaturedRecipes />);
      const headerContainer = screen.getByText(
        "DoughJo: Your One-Stop Shop for Crafting World-Class Pizza at Home"
      ).closest('div');
      expect(headerContainer).toHaveClass(
        'bg-accent text-accent-foreground py-8 px-4 rounded-md shadow-md'
      );
    });
  });
});