import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STUDENTS = [
  { id: 'SKSM00124', name: 'Ahmad Zaki bin Rosli', class: '4 Arif', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBl_Rkjsh96NbSMMl1o9BB6-vdYOg_5LgUS_pTbR9NTrA1T8Kosvssw9ReekGoCwl9bou2LMQm7CchBo8d4UgIIDj6l-AzzmSLAV3ArlraK_dwjquOtXRL08wJXQSPFP2IK6zT8v39D5N4JFUiaFVl1O1XN2nDz2T9xXYRlRTttGzzKwfSvgOLw3i2Ur58CzcZsNiob3SwfkLXXZJxMc8DhXhxyN_PWw5PHzivIKe7JWMCMpzEbEn-C23LyLG_uSWSHSG7VPFSc33g-', online: true },
  { id: 'SKSM00125', name: 'Nur Maisarah binti Azlan', class: '4 Arif', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4cnsptZjYoDTNtxxdIFCLzjg12tC-BLl5bIsbBa81TyJtqga3d5X7fZN5boYA4eB4hZQkqH5Ks3hdck02JMTtMmGe0kwDdOaTcaGKkEQESYoPdqt52DCboQ-GHXaPLa_BhRaJs0kVYoL3aZ44nP8mHJMEYpqOOF-8axN8MvQuw32lluQ_D2H3omjbOaKMb4T0lRpzxjDhWQQaffXC7NTAiszRSB27o5rev9L9d2WvLVQPygEE-cjCpsCq29-2_IV88uN6G3Eh5r0k', online: false },
  { id: 'SKSM00126', name: 'Muhammad Farhan bin Johan', class: '4 Arif', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHHnbKoTg_ETmA3xXylpJqTKtRdEVHAfWPJeGP236h6AX87UepDzbx64IFF3qv3WmEkmxs0rSiVwuvSich0ltJjT9WzzvTBQ-KxM0DcTrSYalA-rob0kzSWhigBsb_9ntI0D_7raqHPYweZ8Ddie3k4eNT2fYnskSDd6owtFJhn71giyZgmwqUlMwPglt2Ej5bA-pQkUN4aZevxMdFALTOJ-Jx_8m9PFjrW30Q-beRC8bJtuh37oVQ4vJCGVQujXBPmSCVTlKVYl2f', online: false },
  { id: 'SKSM00127', name: 'Siti Khadijah binti Rahim', class: '4 Arif', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAO5CXa_fQreDe4plv3DJl5AJob1SillCOasdOBn9YXwVCjEmJwb27Wc1fWPyBXSLvxIexyggZD0xJixfdTe0kqPNqvBPLzmlAI-Q-Ey1hq917fJAvwWZyS39CQVN2XUovUD4wu4nemFI98u9roMmsrDgn15KHujn_lfuQuTOaJa6ED6cCeensGaCqYEiBY6OqISVj4HDTgU25Rccnjm84aJRSb4xnhOx5GxNnnURt3beTal7TEeHL8em9rzNQxvqkN1HYq5p-TUPfV', online: false },
  { id: 'SKSM00128', name: 'Irfan Hakim bin Zakaria', class: '4 Arif', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRRbDoaJqhR_Oax_yqRifgWVZ8gvnuK6WSJgGjpaBG4fxLF67WOX1CAi6ZxNgXUPTGOKDyM9XN2L4bmt92VD3buewIONuqntdnfH3e_PzZzGE1Zx0jXNnofEldoCu1EWhwNeURKhcwG0mEYFKFXsHOi3i2sDuv1sCDD2p6lO4BAbAqOlnkS4SZBiCvO1i9XqNi20eUW9IbAS5YJ_3V6nOo7E3RK93IgcY799jV57D4W2bef9sB926vdcfVZfaOSDyCsxCuDtbjlX33', online: false },
]

const YEARS = ['Tahun 4', 'Tahun 5', 'Tahun 6']
const CLASSES = ['Arif', 'Bijak', 'Cerdik', 'Pintar']

export default function StudentManagement() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [yearIndex, setYearIndex] = useState(0)
  const [classIndex, setClassIndex] = useState(0)

  return (
    <>
      <header className="sticky top-0 z-40 bg-background-dark/80 ios-blur border-b border-white/10">
        <div className="flex items-center p-4 justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => navigate('/app/utama')} className="text-primary p-1 -ml-1" aria-label="Kembali">
              <span className="material-symbols-outlined">arrow_back_ios</span>
            </button>
            <h1 className="text-xl font-bold tracking-tight">Pengurusan Murid</h1>
          </div>
          <button
            type="button"
            className="bg-primary hover:bg-primary/90 text-background-dark h-10 w-10 rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-lg shadow-primary/20"
            aria-label="Tambah murid"
          >
            <span className="material-symbols-outlined font-bold">add</span>
          </button>
        </div>
        <div className="px-4 pb-4 max-w-md mx-auto">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-[20px]">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-primary text-sm placeholder-white/30 transition-all"
              placeholder="Cari nama atau ID murid..."
            />
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto">
        <div className="flex gap-2 px-4 py-3 overflow-x-auto hide-scrollbar">
          {YEARS.map((y, i) => (
            <button
              key={y}
              type="button"
              onClick={() => setYearIndex(i)}
              className={`flex h-9 shrink-0 items-center justify-center rounded-full px-5 text-sm font-semibold transition-all ${
                i === yearIndex ? 'bg-primary text-background-dark' : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {y}
            </button>
          ))}
        </div>

        <div className="border-b border-white/10 px-4">
          <div className="flex gap-6 overflow-x-auto hide-scrollbar">
            {CLASSES.map((c, i) => (
              <button
                key={c}
                type="button"
                onClick={() => setClassIndex(i)}
                className={`flex flex-col items-center border-b-2 py-3 px-1 ${
                  i === classIndex ? 'border-primary text-primary font-bold' : 'border-transparent text-white/40 font-medium'
                }`}
              >
                <span className="text-sm">{c}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {STUDENTS.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-4 px-4 py-4 hover:bg-white/5 transition-colors group"
            >
              <div className="relative shrink-0">
                <div
                  className="size-14 rounded-full bg-white/10 bg-center bg-no-repeat bg-cover"
                  style={{ backgroundImage: `url('${s.img}')` }}
                  role="img"
                  aria-label={s.name}
                />
                {s.online && (
                  <div className="absolute bottom-0 right-0 size-4 bg-primary rounded-full border-2 border-background-dark" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold truncate">{s.name}</h3>
                <p className="text-xs text-white/50 font-mono mt-0.5">ID: {s.id} • {s.class}</p>
              </div>
              <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                <button type="button" className="p-2 text-white/60 hover:text-primary transition-colors" aria-label="Edit">
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                </button>
                <button type="button" className="p-2 text-white/60 hover:text-red-500 transition-colors" aria-label="Padam">
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 py-6 text-center">
          <p className="text-sm text-white/40">Menunjukkan 5 daripada 32 murid</p>
          <button type="button" className="mt-4 text-primary text-sm font-semibold hover:underline">
            Lihat Semua
          </button>
        </div>
      </div>
    </>
  )
}
