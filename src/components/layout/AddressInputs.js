export default function AddressInputs({
  addressProps,
  setAddressProp,
  disabled = false,
}) {
  const { phone, streetAddress, postalCode, city, country } = addressProps || {};

  return (
    <>
      <label>Telefon</label>
      <input
        disabled={disabled}
        type="tel"
        placeholder="Broj telefona"
        value={phone || ""}
        onChange={(ev) => setAddressProp("phone", ev.target.value)}
      />

      <label>Adresa</label>
      <input
        disabled={disabled}
        type="text"
        placeholder="Ulica i broj"
        value={streetAddress || ""}
        onChange={(ev) => setAddressProp("streetAddress", ev.target.value)}
      />

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label>Poštanski broj</label>
          <input
            disabled={disabled}
            type="text"
            placeholder="Poštanski broj"
            value={postalCode || ""}
            onChange={(ev) => setAddressProp("postalCode", ev.target.value)}
          />
        </div>

        <div>
          <label>Grad</label>
          <input
            disabled={disabled}
            type="text"
            placeholder="Grad"
            value={city || ""}
            onChange={(ev) => setAddressProp("city", ev.target.value)}
          />
        </div>
      </div>

      <label>Država</label>
      <input
        disabled={disabled}
        type="text"
        placeholder="Država"
        value={country || ""}
        onChange={(ev) => setAddressProp("country", ev.target.value)}
      />
    </>
  );
}
