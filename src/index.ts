import * as readline from "readline";

// --------------------------------------------------
// 1. Product 型の定義
// --------------------------------------------------
interface Product {
  id: number;
  name: string;
  price: number;
}

// --------------------------------------------------
// 2. ProductManager クラスの作成
// --------------------------------------------------
class ProductManager {
  private products: Product[] = [];
  private nextId: number = 1;

  // 商品を追加する
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

  // 全ての商品を表示する
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

  // キーワードで商品を検索する
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

  // IDで商品を削除する
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
// 3. メインロジック
// --------------------------------------------------
const productManager = new ProductManager();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const displayMenu = () => {
  console.log("\n--- 商品管理アプリケーション ---");
  console.log("1. 商品を追加");
  console.log("2. 商品を表示");
  console.log("3. 商品を検索");
  console.log("4. 商品を削除");
  console.log("5. 終了");
  console.log("--------------------------------\n");
};

const handleInput = (input: string) => {
  switch (input.trim()) {
    case "1":
      rl.question("商品名を入力してください: ", (name) => {
        rl.question("価格を入力してください: ", (priceStr) => {
          const price = parseFloat(priceStr);
          if (isNaN(price) || price <= 0) {
            console.log("⚠️ 無効な価格です。数値を入力してください。");
          } else {
            try {
              productManager.addProduct(name.trim(), price);
            } catch (error: any) {
              console.error(`エラー: ${error.message}`);
            }
          }
          promptUser();
        });
      });
      break;
    case "2":
      productManager.listProducts();
      promptUser();
      break;
    case "3":
      rl.question("検索キーワードを入力してください: ", (keyword) => {
        productManager.searchProducts(keyword.trim());
        promptUser();
      });
      break;
    case "4":
      rl.question("削除する商品IDを入力してください: ", (idStr) => {
        const id = parseInt(idStr);
        if (isNaN(id)) {
          console.log("⚠️ 無効なIDです。数値を入力してください。");
        } else {
          productManager.deleteProduct(id);
        }
        promptUser();
      });
      break;
    case "5":
      console.log("アプリケーションを終了します。さようなら！👋");
      rl.close();
      break;
    default:
      console.log("🤔 無効な選択です。1から5の数字を入力してください。");
      promptUser();
      break;
  }
};

const promptUser = () => {
  displayMenu();
  rl.question("操作を選択してください (1-5): ", handleInput);
};

// アプリケーション開始
promptUser();

// アプリケーション終了時の処理
rl.on("close", () => {
  process.exit(0);
});
