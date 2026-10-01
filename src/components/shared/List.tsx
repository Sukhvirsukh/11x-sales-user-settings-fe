import Label from "../design/Label";


type ListProps = {
    title?: string
    titleClassName?: string
    list: string[],
    listClassName?: string
    listItemClassName?: string
}

export default function List({ title, titleClassName, list, listClassName, listItemClassName }: ListProps) {
    return (
        <div>
            {title && <Label className={titleClassName}>
                {title}
            </Label>}
            <ul
                className={`my-1 space-y-1 text-base ${listClassName}`}
            >
                {
                    list.map((item, i) => (
                        <li key={`${item}-${i}`} className={`my-2 ${listItemClassName}`}>{item}</li>
                    ))
                }
            </ul>
        </div>
    )
}
