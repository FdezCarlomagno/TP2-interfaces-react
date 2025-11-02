export default function ImagePreview({ images, selectedIndex }) {
  return (
    <div className="blocka-preview">
      {images.map((img, index) => (
        <img
          key={index}
          src={img || "/placeholder.svg"}
          className={`preview-thumb ${selectedIndex === index ? "active" : ""}`}
          alt={`Preview ${index}`}
        />
      ))}
    </div>
  )
}