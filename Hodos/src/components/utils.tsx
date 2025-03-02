import { toast } from 'react-toastify';


export const handleSuccess = (msg: string) => {
    toast.success(msg, {
        position: 'top-right'
    })
}

export const handleInfo = (msg: string) => {
    toast.info(msg, {
        position: 'top-right'
    })
}

export const handleWarn = (msg: string) => {
    toast.warning(msg, {
        position: 'top-right'
    })
}

export const handleError = (msg: string) => {
    toast.error(msg, {
        position: 'top-right'
    })
}

