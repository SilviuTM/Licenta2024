function RemoveIfExists({parent, child}){
    if(child)
    {
        RemoveAllChildren(child);
        parent.removeChild(child);
    }
}

function RemoveAllChildren(parent) {
    while (parent.lastChild)
        parent.removeChild(parent.lastChild);
}