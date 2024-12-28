const sendId = (id: string) => {
    return id.toLowerCase().split(/[-_\s]+/).join('-');
}

export default sendId;