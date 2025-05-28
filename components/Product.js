import { useSelector } from "react-redux";
import { useState } from "react";

const Product = ({
  id,
  adi,
  resim_url,
  icerik,
  aciklama,
  fiyat,
  setOpenModal,
  alerjan,
  setSelectedProduct,
}) => {
  const account = useSelector(({ auth }) => auth.account);

  const formatPrice = (price) => {
    // Fiyatı binlik formata dönüştürme
    const formattedPrice = price.toLocaleString("tr-TR", {
      maximumFractionDigits: 2,
    });

    // Binlik ayrımı için noktayı değiştirme
    const priceWithDot = formattedPrice.replace(",", ".");

    return priceWithDot;
  };
  const productSelectHandler = () => {
    setSelectedProduct({
      product_name: adi,
      urun_id: id,
      icerik: icerik,
      fiyat: fiyat,
      aciklama: aciklama,
      resim_url: resim_url,
      alerjen: alerjan,
      brand_logo: account?.brand_logo,
    });
    setOpenModal(true);
  };
  
  
  // Local state for quantity
  const [quantity, setQuantity] = useState(1);

  // Sipariş Ver API isteği
  const handleOrder = async (e) => {
    e.stopPropagation();

    console.log("PAYLOAD", {
          urun_id: id,
          adet: quantity,
    });

    try {
      const response = await fetch("/api/siparis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          urun_id: id,
          adet: quantity,
        }),
      });

      console.log('RESPONSE', response);
      console.log('RESPONSE BODY', response.body);

      if (!response.ok) {
        throw new Error("Sipariş oluşturulurken bir hata oluştu.");
      }
      const data = await response.json();
      console.log('DATA', data);

    } catch (err) {
      // Hata yönetimi ekleyebilirsiniz
      alert("Sipariş verilirken bir hata oluştu.");
    }
  };

  return (
    <div
      key={id}
      className="grid grid-cols-4 gap-4 p-5 text-black cursor-pointer"
      onClick={() => productSelectHandler()}
    >
      <div className="col-span-1">
        <img
          src={resim_url ? resim_url : account?.brand_logo}
          alt={adi}
          className="w-full h-full object-fill sm:h-auto rounded-md"
        />
      </div>
      <div className="col-span-3">
        <div className="mb-2 font-bold">{adi}</div>
        <div className="text-sm mb-2">{icerik ? icerik : ""}</div>
        <div className="text-gray-700 font-bold">
          {formatPrice(parseInt(fiyat))}₺
        </div>
        <div className="text-gray-700 font-bold">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className={`px-2 py-1 rounded ${
                quantity === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              disabled={quantity === 1}
              onClick={e => {
                e.stopPropagation();
                if (quantity > 1) setQuantity(quantity - 1);
              }}
            >
              -
            </button>
            <span className="px-2">{quantity}</span>
            <button
              type="button"
              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              onClick={e => {
                e.stopPropagation();
                setQuantity(quantity + 1);
              }}
            >
              +
            </button>
            <button
              type="button"
              className="ml-4 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={handleOrder}
            >
              Sipariş Ver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
