import { describe, test, expect, beforeEach, jest } from '@jest/globals';

// --------------------------------------------------
// テスト対象のクラスと型定義
// --------------------------------------------------
interface Product {
  id: number;
  name: string;
  price: number;
}

class ProductManager {
  private products: Product[] = [];
  private nextId: number = 1;

  addProduct(name: string, price: number): Product {
    if (!name || price <= 0) {
      throw new Error("商品名と価格は有効な値を入力してください。");
    }
    const newProduct: Product = {
      id: this.nextId++,
      name,
      price,
    };
    this.products.push(newProduct);
    console.log(
      `✨ 商品「${newProduct.name}」を追加しました。(ID: ${newProduct.id})`
    );
    return newProduct;
  }

  listProducts(): Product[] {
    if (this.products.length === 0) {
      console.log("商品がありません。");
      return [];
    }
    console.log("\n--- 商品リスト ---");
    this.products.forEach((product) => {
      console.log(
        `ID: ${product.id}, 名前: ${product.name}, 価格: ${product.price}円`
      );
    });
    console.log("------------------\n");
    return this.products;
  }

  searchProducts(keyword: string): Product[] {
    const foundProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(keyword.toLowerCase())
    );

    if (foundProducts.length === 0) {
      console.log(`「${keyword}」に一致する商品は見つかりませんでした。`);
      return [];
    }

    console.log(`\n--- 検索結果 (キーワード: "${keyword}") ---`);
    foundProducts.forEach((product) => {
      console.log(
        `ID: ${product.id}, 名前: ${product.name}, 価格: ${product.price}円`
      );
    });
    console.log("-------------------------------------------\n");
    return foundProducts;
  }

  deleteProduct(id: number): boolean {
    const initialLength = this.products.length;
    this.products = this.products.filter((product) => product.id !== id);

    if (this.products.length < initialLength) {
      console.log(`🗑️ 商品ID ${id} を削除しました。`);
      return true;
    } else {
      console.log(`商品ID ${id} は見つかりませんでした。`);
      return false;
    }
  }
}

// --------------------------------------------------
// テストスイート
// --------------------------------------------------
describe('ProductManager', () => {
  let productManager: ProductManager;
  let consoleSpy: jest.SpiedFunction<typeof console.log>;

  beforeEach(() => {
    productManager = new ProductManager();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('addProduct', () => {
    test('正常な商品を追加できる', () => {
      const product = productManager.addProduct('テストProduct', 1000);
      
      expect(product).toEqual({
        id: 1,
        name: 'テストProduct',
        price: 1000
      });
      expect(consoleSpy).toHaveBeenCalledWith(
        '✨ 商品「テストProduct」を追加しました。(ID: 1)'
      );
    });

    test('複数の商品を追加すると、IDが自動インクリメントされる', () => {
      const product1 = productManager.addProduct('商品1', 500);
      const product2 = productManager.addProduct('商品2', 1500);
      
      expect(product1.id).toBe(1);
      expect(product2.id).toBe(2);
    });

    test('商品名が空文字列の場合、エラーが発生する', () => {
      expect(() => {
        productManager.addProduct('', 1000);
      }).toThrow('商品名と価格は有効な値を入力してください。');
    });

    test('価格が0以下の場合、エラーが発生する', () => {
      expect(() => {
        productManager.addProduct('テスト商品', 0);
      }).toThrow('商品名と価格は有効な値を入力してください。');

      expect(() => {
        productManager.addProduct('テスト商品', -100);
      }).toThrow('商品名と価格は有効な値を入力してください。');
    });

    test('商品名がnullの場合、エラーが発生する', () => {
      expect(() => {
        productManager.addProduct(null as any, 1000);
      }).toThrow('商品名と価格は有効な値を入力してください。');
    });
  });

  describe('listProducts', () => {
    test('商品がない場合、空配列を返し、適切なメッセージを表示する', () => {
      const products = productManager.listProducts();
      
      expect(products).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith('商品がありません。');
    });

    test('商品がある場合、全ての商品を返し、リストを表示する', () => {
      productManager.addProduct('商品A', 100);
      productManager.addProduct('商品B', 200);
      
      consoleSpy.mockClear(); // addProductでのconsole.logをクリア
      
      const products = productManager.listProducts();
      
      expect(products).toHaveLength(2);
      expect(products[0]).toEqual({ id: 1, name: '商品A', price: 100 });
      expect(products[1]).toEqual({ id: 2, name: '商品B', price: 200 });
      
      expect(consoleSpy).toHaveBeenCalledWith('\n--- 商品リスト ---');
      expect(consoleSpy).toHaveBeenCalledWith('ID: 1, 名前: 商品A, 価格: 100円');
      expect(consoleSpy).toHaveBeenCalledWith('ID: 2, 名前: 商品B, 価格: 200円');
      expect(consoleSpy).toHaveBeenCalledWith('------------------\n');
    });
  });

  describe('searchProducts', () => {
    beforeEach(() => {
      productManager.addProduct('Apple iPhone', 80000);
      productManager.addProduct('Samsung Galaxy', 70000);
      productManager.addProduct('Apple iPad', 50000);
      consoleSpy.mockClear(); // addProductでのconsole.logをクリア
    });

    test('キーワードに一致する商品を検索できる', () => {
      const results = productManager.searchProducts('Apple');
      
      expect(results).toHaveLength(2);
      expect(results[0].name).toBe('Apple iPhone');
      expect(results[1].name).toBe('Apple iPad');
      
      expect(consoleSpy).toHaveBeenCalledWith('\n--- 検索結果 (キーワード: "Apple") ---');
    });

    test('大文字小文字を区別しない検索ができる', () => {
      const results = productManager.searchProducts('apple');
      
      expect(results).toHaveLength(2);
      expect(results[0].name).toBe('Apple iPhone');
      expect(results[1].name).toBe('Apple iPad');
    });

    test('部分一致で検索できる', () => {
      const results = productManager.searchProducts('Gal');
      
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Samsung Galaxy');
    });

    test('一致する商品がない場合、空配列を返す', () => {
      const results = productManager.searchProducts('Nokia');
      
      expect(results).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith('「Nokia」に一致する商品は見つかりませんでした。');
    });

    test('空文字列で検索すると全ての商品が返される', () => {
      const results = productManager.searchProducts('');
      
      expect(results).toHaveLength(3);
    });
  });

  describe('deleteProduct', () => {
    beforeEach(() => {
      productManager.addProduct('商品1', 1000);
      productManager.addProduct('商品2', 2000);
      productManager.addProduct('商品3', 3000);
      consoleSpy.mockClear(); // addProductでのconsole.logをクリア
    });

    test('存在するIDの商品を削除できる', () => {
      const result = productManager.deleteProduct(2);
      
      expect(result).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith('🗑️ 商品ID 2 を削除しました。');
      
      const products = productManager.listProducts();
      expect(products).toHaveLength(2);
      expect(products.find(p => p.id === 2)).toBeUndefined();
    });

    test('存在しないIDの商品を削除しようとすると失敗する', () => {
      const result = productManager.deleteProduct(999);
      
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('商品ID 999 は見つかりませんでした。');
      
      const products = productManager.listProducts();
      expect(products).toHaveLength(3); // 削除されていない
    });

    test('削除後、残りの商品のIDは変更されない', () => {
      productManager.deleteProduct(2);
      
      const products = productManager.listProducts();
      expect(products[0].id).toBe(1);
      expect(products[1].id).toBe(3);
    });
  });

  describe('統合テスト', () => {
    test('商品の追加、検索、削除の一連の操作が正常に動作する', () => {
      // 商品を追加
      productManager.addProduct('ノートPC', 80000);
      productManager.addProduct('マウス', 2000);
      productManager.addProduct('キーボード', 5000);
      
      // 検索
      let results = productManager.searchProducts('ノート');
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('ノートPC');
      
      // 削除
      const deleteResult = productManager.deleteProduct(1);
      expect(deleteResult).toBe(true);
      
      // 削除後の確認
      results = productManager.searchProducts('ノート');
      expect(results).toHaveLength(0);
      
      const allProducts = productManager.listProducts();
      expect(allProducts).toHaveLength(2);
    });
  });
});