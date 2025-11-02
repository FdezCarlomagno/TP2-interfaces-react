export default function FinalPreview({ image }) {
  if (!image) return null

  return (
    <div className="final-preview-image-container">
      <img src={image || "/placeholder.svg"} alt="Selected preview" className="final-preview-image" />
    </div>
  )
}