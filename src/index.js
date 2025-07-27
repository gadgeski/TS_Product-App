"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline");
// --------------------------------------------------
// 2. ProductManager クラスの作成
// --------------------------------------------------
var ProductManager = /** @class */ (function () {
    function ProductManager() {
        this.products = [];
        this.nextId = 1;
    }
    // 商品を追加する
    ProductManager.prototype.addProduct = function (name, price) {
        if (!name || price <= 0) {
            throw new Error("商品名と価格は有効な値を入力してください。");
        }
        var newProduct = {
            id: this.nextId++,
            name: name,
            price: price,
        };
        this.products.push(newProduct);
        console.log("\u2728 \u5546\u54C1\u300C".concat(newProduct.name, "\u300D\u3092\u8FFD\u52A0\u3057\u307E\u3057\u305F\u3002(ID: ").concat(newProduct.id, ")"));
        return newProduct;
    };
    // 全ての商品を表示する
    ProductManager.prototype.listProducts = function () {
        if (this.products.length === 0) {
            console.log("商品がありません。");
            return [];
        }
        console.log("\n--- 商品リスト ---");
        this.products.forEach(function (product) {
            console.log("ID: ".concat(product.id, ", \u540D\u524D: ").concat(product.name, ", \u4FA1\u683C: ").concat(product.price, "\u5186"));
        });
        console.log("------------------\n");
        return this.products;
    };
    // キーワードで商品を検索する
    ProductManager.prototype.searchProducts = function (keyword) {
        var foundProducts = this.products.filter(function (product) {
            return product.name.toLowerCase().includes(keyword.toLowerCase());
        });
        if (foundProducts.length === 0) {
            console.log("\u300C".concat(keyword, "\u300D\u306B\u4E00\u81F4\u3059\u308B\u5546\u54C1\u306F\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3067\u3057\u305F\u3002"));
            return [];
        }
        console.log("\n--- \u691C\u7D22\u7D50\u679C (\u30AD\u30FC\u30EF\u30FC\u30C9: \"".concat(keyword, "\") ---"));
        foundProducts.forEach(function (product) {
            console.log("ID: ".concat(product.id, ", \u540D\u524D: ").concat(product.name, ", \u4FA1\u683C: ").concat(product.price, "\u5186"));
        });
        console.log("-------------------------------------------\n");
        return foundProducts;
    };
    // IDで商品を削除する
    ProductManager.prototype.deleteProduct = function (id) {
        var initialLength = this.products.length;
        this.products = this.products.filter(function (product) { return product.id !== id; });
        if (this.products.length < initialLength) {
            console.log("\uD83D\uDDD1\uFE0F \u5546\u54C1ID ".concat(id, " \u3092\u524A\u9664\u3057\u307E\u3057\u305F\u3002"));
            return true;
        }
        else {
            console.log("\u5546\u54C1ID ".concat(id, " \u306F\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3067\u3057\u305F\u3002"));
            return false;
        }
    };
    return ProductManager;
}());
// --------------------------------------------------
// 3. メインロジック
// --------------------------------------------------
var productManager = new ProductManager();
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
var displayMenu = function () {
    console.log("\n--- 商品管理アプリケーション ---");
    console.log("1. 商品を追加");
    console.log("2. 商品を表示");
    console.log("3. 商品を検索");
    console.log("4. 商品を削除");
    console.log("5. 終了");
    console.log("--------------------------------\n");
};
var handleInput = function (input) {
    switch (input.trim()) {
        case "1":
            rl.question("商品名を入力してください: ", function (name) {
                rl.question("価格を入力してください: ", function (priceStr) {
                    var price = parseFloat(priceStr);
                    if (isNaN(price) || price <= 0) {
                        console.log("⚠️ 無効な価格です。数値を入力してください。");
                    }
                    else {
                        try {
                            productManager.addProduct(name.trim(), price);
                        }
                        catch (error) {
                            console.error("\u30A8\u30E9\u30FC: ".concat(error.message));
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
            rl.question("検索キーワードを入力してください: ", function (keyword) {
                productManager.searchProducts(keyword.trim());
                promptUser();
            });
            break;
        case "4":
            rl.question("削除する商品IDを入力してください: ", function (idStr) {
                var id = parseInt(idStr);
                if (isNaN(id)) {
                    console.log("⚠️ 無効なIDです。数値を入力してください。");
                }
                else {
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
var promptUser = function () {
    displayMenu();
    rl.question("操作を選択してください (1-5): ", handleInput);
};
// アプリケーション開始
promptUser();
// アプリケーション終了時の処理
rl.on("close", function () {
    process.exit(0);
});
