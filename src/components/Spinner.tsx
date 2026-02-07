import { NextPage } from 'next'

interface Props {
    light?: boolean
}

const Spinner: NextPage<Props> = ({light}: Props) => {
  return <div className={`w-6 h-6 border-t-3 rounded-full animate-spin ${light ? 'border-light' : 'border-dark'}`}>

  </div>
}

export default Spinner