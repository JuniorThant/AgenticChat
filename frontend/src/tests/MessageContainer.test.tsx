import { render, screen } from "@testing-library/react";
import MessageContainer from "../components/MessageContainer";
import type { Message } from "../helpers/types";
import { describe, it, expect } from "vitest";
import '@testing-library/jest-dom';

describe("MessageContainer",()=>{
    const sampleMessages:Message[]=[
        {text:"Hello",isUser:true},
        {text:"Hello, How may I help you?",isUser:false},
        {
            text:"What is this Image?",
            isUser:false,
            imageUrl:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fstock.adobe.com%2Fsearch%3Fk%3Dcat&psig=AOvVaw3enAoWZu1D8ZuhCrQ1Fd0U&ust=1750152626002000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCKjDxf7S9Y0DFQAAAAAdAAAAABAE"
        }
    ]

    it("render all messages correctly",()=>{
        render(<MessageContainer messages={sampleMessages}/>)
        expect(screen.getByText("Hello")).toBeInTheDocument()
        expect(screen.getByText("Hello, How may I help you?")).toBeInTheDocument()
        expect(screen.getByText("What is this Image?")).toBeInTheDocument()
    })

    it("render image when there is image",()=>{
        render(<MessageContainer messages={sampleMessages}/>)
        const img=screen.getByAltText("chat-image")
        expect(img).toBeInTheDocument()
        expect(img).toHaveAttribute("src","https://www.google.com/url?sa=i&url=https%3A%2F%2Fstock.adobe.com%2Fsearch%3Fk%3Dcat&psig=AOvVaw3enAoWZu1D8ZuhCrQ1Fd0U&ust=1750152626002000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCKjDxf7S9Y0DFQAAAAAdAAAAABAE")
    })
})