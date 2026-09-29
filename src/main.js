import './style.css'

let products = []
let currentCategory = 'all'
let searchKeyword = ''
// Kalau di browser sudah ada data tersimpan, pakai itu. Kalau belum, pakai array kosong []
let cart = JSON.parse(localStorage.getItem('katalog_cart')) || []
const searchInput = document.getElementById('search-input')
const filterbtn = document.querySelectorAll('.filter-btn')
const cartDrawer = document.getElementById('cart-drawer')
const cartBtn = document.getElementById('cart-btn')
const closeCartBtn = document.getElementById('close-cart-btn')
const cartBackdrop = document.getElementById('cart-backdrop')

function renderProducts(items) {
  const grid = document.getElementById('product-grid')
  grid.innerHTML = ''

  items.forEach(product => {
    const badgeHTML = product.badge 
      ? `<span class="absolute top-3 right-3 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-500/90 text-slate-950 backdrop-blur-md shadow-md">${product.badge}</span>`
      : ''
    const cardHTML = `
      <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition duration-300 flex flex-col justify-between group">
        <!-- Gambar Produk -->
        <div class="relative h-48 overflow-hidden bg-slate-800">
          <img 
            src="${product.image}" 
            alt="${product.name}" 
            class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            loading="lazy"
          />
          ${badgeHTML}
        </div>
        <!-- Info Produk -->
        <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <span class="text-[11px] uppercase tracking-wider font-semibold text-emerald-400">${product.category}</span>
            <h3 class="text-base font-bold text-white mt-1 group-hover:text-emerald-300 transition">${product.name}</h3>
            <p class="text-xs text-slate-400 mt-1 line-clamp-2">${product.description}</p>
          </div>
          <!-- Harga & Tombol Tambah -->
          <div class="flex items-center justify-between pt-3 border-t border-slate-800/80">
            <div>
              <span class="text-xs text-slate-500 block">Harga</span>
              <span class="text-base font-extrabold text-white">Rp ${product.price.toLocaleString('id-ID')}</span>
            </div>
            
            <button 
              type="button" 
              class="add-to-cart-btn px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5 cursor-pointer"
              data-id="${product.id}"
            >
              <span>+ Tambah</span>
            </button>
          </div>
        </div>
      </div>
    `
    grid.innerHTML += cardHTML
  })
}

async function loadProducts() {
  try{
    const response = await fetch('/data/products.json')
    products = await response.json()
    console.log('Data produk berhasil ditarik:', products)
    document.getElementById('loading-state').classList.add('hidden')
    renderProducts(products)
  } catch (error) {
    console.error('Gagal memuat produk:', error)
    document.getElementById('loading-state').textContent = 'Gagal memuat data produk'
  }
}

function filterAndRender() {
  
  const hasilSaring = products.filter(product => {
    // 1. Cek Kategori (kalau 'all', loloskan semua)
    const matchCategory = currentCategory === 'all' || product.category === currentCategory

    // 2. Cek Ketikan Search
    const matchSearch = product.name.toLowerCase().includes(searchKeyword.toLowerCase())

    return matchCategory && matchSearch
  })
  if (hasilSaring.length === 0){
    document.getElementById('empty-state').classList.remove('hidden')
  } else {
    document.getElementById('empty-state').classList.add('hidden')
  }
  renderProducts(hasilSaring)
}

document.getElementById('product-grid').addEventListener('click', (e) => {
  // Cek apakah yang diklik adalah tombol '+ Tambah' atau anak di dalamnya
  const btn = e.target.closest('.add-to-cart-btn')
  if (!btn) return

  // Ambil ID produk dari dataset tombol
  const productId = parseInt(btn.dataset.id)
  addToCart(productId)
  console.log('produk diklik :', productId)
})

function addToCart(productId) {
  // 1. Cari tahu apakah produk tersebut sudah ada di dalam keranjang
  const existingItem = cart.find(item => item.id === productId)

  if (existingItem) {
    // Jika sudah ada, cukup tambahkan jumlahnya (quantity)
    existingItem.qty++
  } else {
    // Jika belum ada, cari data produk asli dari array `products`
    const productData = products.find(p => p.id === productId)
    
    // Masukkan objek baru ke dalam array cart
    if (productData) {
      cart.push({
        id: productData.id,
        name: productData.name,
        price: productData.price,
        image: productData.image,
        qty: 1
      })
    }
  }

  saveCart()

  renderCart()
  cartDrawer.classList.remove('hidden') // Otomatis buka drawer saat barang ditambah!
  
  console.log('isi keranjang:', cart)
}

function renderCart() {
  const cartItemsContainer = document.getElementById('cart-items')
  const cartEmptyMsg = document.getElementById('cart-empty-msg')
  const cartCountBadge = document.getElementById('cart-count')
  const cartTotalEl = document.getElementById('cart-total')
  const checkoutBtn = document.getElementById('checkout-btn')

  // 1. Hitung total item & total harga
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0)
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0)

  // 2. Update badge di navbar & total harga
  cartCountBadge.textContent = totalCount
  cartTotalEl.textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`

  // 3. Kondisi: Jika Keranjang Kosong
  if (cart.length === 0) {
    cartEmptyMsg.classList.remove('hidden')
    cartItemsContainer.innerHTML = ''
    checkoutBtn.disabled = true
    return
  }

  // 4. Kondisi: Jika Ada Isinya
  cartEmptyMsg.classList.add('hidden')
  checkoutBtn.disabled = false
  cartItemsContainer.innerHTML = ''

  // 5. Render setiap item yang ada di keranjang
  cart.forEach(item => {
    const itemHTML = `
      <div class="flex items-center justify-between gap-4 p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
        <!-- Thumbnail & Info -->
        <div class="flex items-center gap-3 min-w-0">
          <img src="${item.image}" alt="${item.name}" class="w-12 h-12 rounded-lg object-cover bg-slate-800 shrink-0" />
          <div class="min-w-0">
            <h4 class="text-sm font-bold text-white truncate">${item.name}</h4>
            <p class="text-xs text-slate-400">Rp ${item.price.toLocaleString('id-ID')}</p>
          </div>
        </div>

        <!-- Tombol Kontrol Jumlah (- QTY +) & Hapus -->
        <div class="flex items-center gap-2 shrink-0">
          <div class="flex items-center border border-slate-700 bg-slate-900 rounded-lg overflow-hidden">
            <button class="decrease-qty-btn px-2.5 py-1 text-slate-300 hover:bg-slate-800 text-xs font-bold transition" data-id="${item.id}">-</button>
            <span class="px-2 text-xs font-bold text-white">${item.qty}</span>
            <button class="increase-qty-btn px-2.5 py-1 text-slate-300 hover:bg-slate-800 text-xs font-bold transition" data-id="${item.id}">+</button>
          </div>

          <!-- Tombol Hapus Sampah -->
          <button class="remove-item-btn p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition" data-id="${item.id}" title="Hapus Produk">
            🗑
          </button>
        </div>
      </div>
    `
    cartItemsContainer.innerHTML += itemHTML
  })
}

function saveCart() {
  localStorage.setItem('katalog_cart', JSON.stringify(cart))
}

filterbtn.forEach(item => {
  item.addEventListener('click', function() {
    filterbtn.forEach(btn => {
      btn.classList.add('bg-slate-900','border','border-slate-800','text-slate-400')
      btn.classList.remove('active','bg-emerald-600')
    })

    currentCategory = this.dataset.category
    this.classList.add('active','bg-emerald-600')
    this.classList.remove('bg-slate-900','border','border-slate-800','text-slate-400')
    console.log(currentCategory)
    filterAndRender(currentCategory)
  })
})

searchInput.addEventListener('input', (e) => {
  searchKeyword = e.target.value
  filterAndRender(searchKeyword)
  console.log(searchKeyword)
})

cartBtn.addEventListener('click', () => {
  cartDrawer.classList.remove('hidden')
})

cartBackdrop.addEventListener('click', () => {
  cartDrawer.classList.add('hidden')
})

closeCartBtn.addEventListener('click', () => {
  cartDrawer.classList.add('hidden')
})

// Event Delegation untuk tombol di dalam keranjang
document.getElementById('cart-items').addEventListener('click', (e) => {
  const increaseBtn = e.target.closest('.increase-qty-btn')
  const decreaseBtn = e.target.closest('.decrease-qty-btn')
  const removeBtn = e.target.closest('.remove-item-btn')

  // 1. Tambah Jumlah (+)
  if (increaseBtn) {
    const id = parseInt(increaseBtn.dataset.id)
    const item = cart.find(i => i.id === id)
    if (item) item.qty++
    saveCart()
    renderCart()
  }

  // 2. Kurang Jumlah (-)
  if (decreaseBtn) {
    const id = parseInt(decreaseBtn.dataset.id)
    const item = cart.find(i => i.id === id)
    if (item) {
      if (item.qty > 1) {
        item.qty--
      } else {
        // Kalau sisa 1 dan dikurang lagi, otomatis hapus dari keranjang
        cart = cart.filter(i => i.id !== id)
      }
      saveCart()
      renderCart()
    }
  }

  // 3. Tombol Hapus Sampah (x)
  if (removeBtn) {
    const id = parseInt(removeBtn.dataset.id)
    cart = cart.filter(i => i.id !== id)
    saveCart()
    renderCart()
  }
})

document.getElementById('checkout-btn').addEventListener('click', () => {
  if (cart.length === 0) return

  // 1. Susun kalimat pesan rapi
  let message = `Halo Admin KatalogKu, saya ingin memesan:\n\n`
  
  cart.forEach(item => {
    message += `• ${item.qty}x ${item.name} - Rp ${(item.price * item.qty).toLocaleString('id-ID')}\n`
  })

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0)
  message += `\n*Total Pembayaran: Rp ${total.toLocaleString('id-ID')}*\n\nMohon info ketersediaan stok & nomor rekening untuk pembayaran. Terima kasih!`

  // 2. Hubungkan ke WhatsApp API dengan nomor kamu
  const phoneNumber = '6282288225830' // Nomor HP resmi Abiyyu
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  // 3. Buka tab baru ke WhatsApp
  window.open(whatsappUrl, '_blank')
})

loadProducts()

renderCart() // Supaya kalau ada data tersimpan di localStorage, langsung digambar saat web dibuka!