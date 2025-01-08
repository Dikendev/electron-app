export type LoadingStatus = 'loading' | 'error' | 'success' | 'idle'

interface LoadingProps {
  status: LoadingStatus
}

const Loading = ({ status }: LoadingProps) => {
  switch (status) {
    case 'loading': {
      return (<>
        <div style={{ height: '2rem' }}>Loading</div>
      </>)
    }
    case 'error': {
      return (<>
        <div style={{ height: '2rem' }}>Error</div>
      </>)
    }
    case 'success': {
      return (<>
        <div style={{ height: '2rem' }}>Sucesso</div>
      </>)
    }
    case 'idle': {
      return (<div style={{ height: '2rem' }}></div>)
    }
  }
}

export default Loading