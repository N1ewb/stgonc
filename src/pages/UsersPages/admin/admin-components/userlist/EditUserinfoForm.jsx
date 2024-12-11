
export default function EditUserinfoForm({handleToggleUserinfoForm}) {
    const handleSubmit = (e) => {
        e.preventDefault()
    }
  return (
    <div onClick={handleToggleUserinfoForm} className="w-full h-full absolute top-0 left-0 bg-[#00000065]">
        <div onClick={(e) => e.stopPropagation()} className="w-[80%] h-auto">
            <form onSubmit={handleSubmit}>
                <div className="group"></div>
                
            </form>
        </div>
    </div>
  )
}
