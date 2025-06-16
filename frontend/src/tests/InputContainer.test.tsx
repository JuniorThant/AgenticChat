import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen} from "@testing-library/react";
import InputContainer from "../components/InputContainer";
import type { Message } from "../helpers/types";
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";

describe("InputContainer", () => {
     let sampleMessages:Message[]=[
        {text:"Hello",isUser:true},
        {text:"Hi, How may I help you?",isUser:false},
    ]
    let setMessages: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    setMessages = vi.fn();
    globalThis.URL.createObjectURL = vi.fn(() => "mocked-url");
  });


  it("renders input elements", () => {
    render(<InputContainer messages={sampleMessages} setMessages={setMessages} />);

    expect(screen.getByPlaceholderText(/type a message/i)).toBeInTheDocument()
    expect(screen.getByTestId("file-upload")).toBeInTheDocument()
    expect(screen.getByTestId("thinking-tool")).toBeInTheDocument()
    expect(screen.getByTestId("send")).toBeInTheDocument()
  });

  it("send user messages and response AI",async()=>{
    render(<InputContainer messages={sampleMessages} setMessages={setMessages} />);

    const input=screen.getByTestId("text")
    const button=screen.getByTestId("send")
    await userEvent.type(input,"Hello")
    await userEvent.click(button)
    expect(setMessages).toHaveBeenCalledWith(
      expect.arrayContaining([
        {text:"Hello",isUser:true},
        {text:"Hi, How may I help you?",isUser:false}
      ])
    );

  })

  it("renders image preview icon and preview image", async () => {
  render(<InputContainer messages={sampleMessages} setMessages={setMessages} />);

  const fileInput = screen.getByTestId("file-upload");
  const file = new File(["dummy"], "testing.jpg", { type: "image/jpg" });
  await userEvent.upload(fileInput, file);
  const arrow = await screen.findByTestId("arrow");
  expect(arrow).toBeInTheDocument();
  await userEvent.click(arrow)
  expect(arrow).toHaveClass("hover:text-blue-500")
  const image=await screen.findByTestId("image-modal");
  expect(image).toBeInTheDocument();
  await userEvent.click(arrow)
  expect(image).not.toBeInTheDocument();
});


});
