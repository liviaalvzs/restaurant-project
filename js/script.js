// funções para facilitar o query selector
const c = (el) =>document.querySelector(el);
const ca = (el) =>document.querySelectorAll(el);

let infoAreaQt = 1; // quantidade selecionada no painel/carrinho
let cart = []; // carrinho
let infoAreaKey = 0 // referencia do alimento na array

// listagem das foods
alimentosJson.map((item, index)=>{
    // atribuindo infos dos alimentos na página inicial
    let alimentoItem = c('.models .food-item').cloneNode(true);
    
    alimentoItem.setAttribute('data-key', index);

    alimentoItem.querySelector('.food-item--img img').src = item.img;
    alimentoItem.querySelector('.food-item--name').innerHTML = item.name;
    alimentoItem.querySelector('.food-item--desc').innerHTML = item.description;
    alimentoItem.querySelector('.food-item--desc').innerHTML = item.description;
    alimentoItem.querySelector('.food-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    
    // adicionando infos no painel
    alimentoItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault(); // bloqueando ação natural de recarregar página
        let key = e.target.closest('.food-item').getAttribute('data-key');
        infoAreaQt = 1;
        infoAreaKey = key;

        // preenchendo infos no painel
        c('.foodBig img').src = alimentosJson[key].img;
        c('.foodInfo h1').innerHTML = alimentosJson[key].name;
        c('.foodInfo--desc').innerHTML = alimentosJson[key].description;
        c('.foodInfo--actualPrice').innerHTML = `R$ ${alimentosJson[key].price.toFixed(2)}`;
        ca('.foodInfo--size').forEach((size, sizeIndex) => {
            if(sizeIndex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = alimentosJson[key].sizes[sizeIndex];
        });

        c('.foodInfo--qt').innerHTML = infoAreaQt;
        
        // mostrando painel de info
        c('.foodWindowArea').style.opacity = 0;
        c('.foodWindowArea').style.display = 'flex';
        setTimeout(()=>{
            c('.foodWindowArea').style.opacity = 1;
        }, 200);
    });
    
    c('.food-area').append(alimentoItem)
});



// função p/ fechar o painel de infos
function closeFoodInfo () {
    c('.foodWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.foodWindowArea').style.display = 'none';
    }, 500);
} 

// saindo do painel de infos
ca('.foodInfo--cancelButton, .foodInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeFoodInfo);
});

// botões de incrementar e reduzir quantidade
c('.foodInfo--qtmenos').addEventListener('click', ()=>{
    if(infoAreaQt > 1) {
        infoAreaQt--;
        c('.foodInfo--qt').innerHTML = infoAreaQt;
    }
    });
    
c('.alimentoInfo--incrementa').addEventListener('click', ()=>{
    infoAreaQt++;
    c('.foodInfo--qt').innerHTML = infoAreaQt;
});

// mudando o size dos alimentos
ca('.foodInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        c('.foodInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

// adicionando no carrinho
c('.foodInfo--addButton').addEventListener('click', ()=>{
    // identificando o alimento, o tamanho e a quantidade a ser adicionada no carrinho
    let size = parseInt(c('.foodInfo--size.selected').getAttribute('data-key')); // tamanho

    let identifier = alimentosJson[infoAreaKey].id+"@"+size // identificador do item + tamanho

    let key = cart.findIndex((item)=> item.identifier == identifier); //

    if(key > -1) {
        cart[key].qt += infoAreaQt;
    } else {
        cart.push({
            identifier,
            id:alimentosJson[infoAreaKey].id,
            size,
            qt:infoAreaQt
        });
    }
    updateCart(); // atualiza o carrinho
    closeFoodInfo(); // fecha o painel de infos após adicionar ao carrinho o que deseja
});
    


// abrir carrinho casa exista algo na array
c('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0) {
        c('aside').style.left = '0';
    } 
});
c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
});


// atualiza carrinho de acordo com as infos da array
function updateCart() {
    c('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {
            let foodItem = alimentosJson.find((item)=>item.id == cart[i].id);
            subtotal += foodItem.price * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);

            // vendo qual o tamanho (P, M ou G) de acordo com o n° da key de tamanho
            let foodSizeName;
            switch(cart[i].size) {
                case 0:
                    foodSizeName = 'P';
                    break;
                case 1:
                    foodSizeName = 'M';
                    break;
                case 2:
                    foodSizeName = 'G';
                    break;
            }
            let foodName = `${foodItem.name} (${foodSizeName})`;

            cartItem.querySelector('img').src = foodItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = foodName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });

            c('.cart').append(cartItem);
        }

        // adiciona desconto de 10%
        desconto = subtotal * 0.1;
        total = subtotal - desconto; 

        // mostra infos de preço
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else { // tira o carrinho da tela
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}
    
    




