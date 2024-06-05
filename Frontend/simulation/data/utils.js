function RemoveIfExists({parent, child}){
    if(child)
        parent.removeChild(child);
}