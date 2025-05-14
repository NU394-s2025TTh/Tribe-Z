import { useSearchParams } from 'react-router-dom';
import { StoreIngredientCard } from '../components/sections/StoreIngredientCard';
import { useState, useEffect } from 'react';

const ingredientData = [
  {
    id: 1,
    name: 'Red Star Yeast',
    type: {
      name: 'yeast',
      description: 'Active dry yeast for baking',
    },
    price: '$8.99',
    preferredVendor: 'Amazon',
    link: 'https://www.amazon.com/Red-Star-Active-Dry-Yeast/dp/B0014CWDJO',
  },
  {
    id: 2,
    name: 'Antimo Caputo 00 Flour',
    type: {
      name: 'flour',
      description: '00 flour for pizza dough',
    },
    price: '$14.95',
    preferredVendor: 'Amazon',
    link: 'https://www.amazon.com/Antimo-Caputo-Chefs-Flour-Kilo/dp/B07144K4T6',
  },
  {
    id: 3,
    name: 'Anthony’s Diastatic Malt',
    type: {
      name: 'malt',
      description: 'Diastatic malt powder for pizza dough',
    },
    price: '$13.49',
    preferredVendor: 'Amazon',
    link: 'https://www.amazon.com/dp/B00WGUYX96?tag=autopark-20&linkCode=osi&th=1&psc=1&keywords=diastatic%20malt%20powder',
  },
  {
    id: 4,
    name: 'Strianese San Marzano Tomatoes',
    type: {
      name: 'tomatoes',
      description: 'San Marzano tomatoes for pizza sauce',
    },
    price: '$25.99',
    preferredVendor: 'Amazon',
    link: 'https://www.amazon.com/Strianese-San-Marzano-Tomatoes-Pack/dp/B004ROGYDM',
  },
  {
    id: 5,
    name: 'Whole Foods 365 Kosher Salt',
    type: {
      name: 'salt',
      description: 'Kosher salt for seasoning',
    },
    price: '$3.29',
    preferredVendor: 'Amazon',
    link: 'https://www.amazon.com/365-Everyday-Value-Kosher-Coarse/dp/B074H5TMQ7?crid=12ZAWCLLHR8XU&dib=eyJ2IjoiMSJ9.pcg573Ss3CwpFpJUDIl-bEtgVo7lvXyxjdFsrJWvMMYufoPoVG_pmryqMirq8ACIBp32e6kPg6Q6Pi0mfo2LGFh02EZmjMryVlnb2jAM3J-MqcKSlukb9sZFsaU1MKZOFMuSXh6gQV11Wv8kE6S5iXd0qhqlT6R6zRDqsad32pTlCBXSKhhna9usD33cruFwQs295Tv5_3mQJrIx86kb1FkDiTdmjf30ee8p4DDMb0x4TN5uJHq09aK_Ba7zrfXr04Of1XQYSev31lc3eTNMojNnifh9qFLXsM4Wg2hiHi4.K6zLDrxaf1JAhl9fet4D1z8sT7faonlxitL3gfegilk&dib_tag=se&keywords=kosher%2Bsalt&qid=1747150869&s=grocery&sprefix=kosher%2Bsal%2Cgrocery%2C247&sr=1-5&th=1',
  },
  {
    id: 6,
    name: 'Filippo Berio Extra Virgin Olive Oil',
    type: {
      name: 'olive oil',
      description: 'Extra virgin olive oil for drizzling',
    },
    price: '$7.32',
    preferredVendor: 'Amazon',
    link: 'https://www.amazon.com/Filippo-Berio-Extra-Virgin-Olive/dp/B004ZK4AES?th=1',
  },
  {
    id: 7,
    name: 'Amazon Grocery Basil Leaves',
    type: {
      name: 'basil',
      description: 'Dried basil leaves for seasoning',
    },
    price: '$1.89',
    preferredVendor: 'Amazon',
    link: 'https://www.amazon.com/Amazon-Grocery-Previously-Fresh-Packaging/dp/B097F282FC?dib=eyJ2IjoiMSJ9.6HQSDQk2-QQw2i69AoELJ3Yobf6um36s5b7D-eD2hSMv7_eAwuez2yMssU2Dmxfe9DXpwFRnhV7be2zVyhjZlvfozGFqqhaALvL713hbFzvVpMHh5za6A65AMOHfqIEoRI0no_kSjcIhfDPfyKt7vWOz4TBhHeX_ERBvvxQnMkKfk6zM08XS8lrZz_DzGofAF-xQ6QfiQPXu4d8sukNVxmVBDnXnoNJpoDlbWPBuawxuTezAM8YrnrUnv-7IcfO9NAvvI-hGYIWKlNYZSM_MGV5HBP_5F4vk9xIK_9j3FkY.qqd_gy7lVrGPwyau1zFoiAJfyv8UY0O3O56rMJephzw&dib_tag=se&keywords=basil+leaves&qid=1747161466&sr=8-5',
  },
  {
    id: 8,
    name: 'Grande Mozzarella Curd',
    type: {
      name: 'cheese',
      description: 'Mozzarella cheese curd for pizza',
    },
    price: '$9.29',
    preferredVendor: 'PennMac',
    link: 'https://www.pennmac.com/items/5130//Grande-Mozzarella-Curd-Cheese',
  },
];

function PizzaPackage() {
  const [searchParams] = useSearchParams();
  const pizzaName = searchParams.get('pizza');
  const formattedPizzaName = pizzaName
    ? pizzaName.charAt(0).toUpperCase() + pizzaName.slice(1)
    : '';

  const [storeToIngredients, setStoreToIngredients] = useState<
    Record<string, any[]>
  >({});

  useEffect(() => {
    const transformedData = ingredientData.reduce((acc, ingredient) => {
      const storeName = ingredient.preferredVendor || 'Unknown Store';
      if (!acc[storeName]) {
        acc[storeName] = [];
      }
      acc[storeName].push(ingredient);
      return acc;
    }, {} as Record<string, any[]>);

    setStoreToIngredients(transformedData);
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl text-center sm:text-3xl md:text-4xl font-bold">
        {formattedPizzaName} Pizza Package
      </h1>

      <div className="flex flex-col items-center gap-4 mt-4">
        {Object.entries(storeToIngredients).map(([storeName, ingredients]) => (
          <StoreIngredientCard
            key={storeName}
            ingredients={ingredients}
            storeName={storeName}
          />
        ))}
      </div>
    </div>
  );
}
export default PizzaPackage;
