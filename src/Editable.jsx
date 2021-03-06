import React, { useRef, useState } from "react";
import PropTypes from 'prop-types';
import {
    InputContainer,
    InputWrapper
} from './style'
const Editable = ({ onChange, type, maxLength, height, width, value, disabled }) => {
    const inputRef = useRef();
    const [data] = useState(value);
    const [borderBottom, setBorderBottom] = useState("2px solid gainsboro");
    const placeCaretAtEnd = el => {
        el.focus();
        if (
            typeof window.getSelection !== "undefined" &&
            typeof document.createRange !== "undefined"
        ) {
            const range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (typeof document.body.createTextRange !== "undefined") {
            const textRange = document.body.createTextRange();
            textRange.moveToElementText(el);
            textRange.collapse(false);
            textRange.select();
        }
    };
    const onClick = () => {
        if (!disabled) {
            setBorderBottom("2px solid blue");
        }
    };
    const onBlur = () => {
        setBorderBottom("2px solid gainsboro");
    };
    const onKeyUp = function(e) {
        const { textContent } = e.currentTarget;
        const rem = +maxLength - inputRef.current.innerText.length;
        if (rem <= 0) {
            const slicedText = textContent.slice(0, +maxLength);
            inputRef.current.innerText = slicedText;
            placeCaretAtEnd(inputRef.current);
            onChange(slicedText);
        } else {
            onChange(textContent);
        }
    };
    const onPaste = e => {
        e.preventDefault();
        const { textContent } = e.currentTarget;
        const text = e.clipboardData.getData("text/plain");
        const fullText = textContent + text;
        const mData = fullText.slice(0, +maxLength);
        inputRef.current.innerHTML = "";
        document.execCommand("insertHTML", false, mData);
    };
    return (
        <InputContainer width={width}>
            <InputWrapper width={width}>
                <div
                    className={type}
                    ref={inputRef}
                    contentEditable={!disabled}
                    onClick={onClick}
                    onBlur={onBlur}
                    onInput={onKeyUp}
                    onPaste={onPaste}
                    style={{ height: height === 'auto' ? 'auto': `${height}px`, borderBottom: borderBottom, minWidth: 200 }}
                    disabled={disabled}
                    dangerouslySetInnerHTML={{ __html: data.replace(/\n/g, "<br/>") }}
                />
            </InputWrapper>
        </InputContainer>
    );
};

Editable.defaultProps = {
    width: 'auto',
    height: 'auto',
    type: 'text',
    value: "",
    disabled: false
};

Editable.propTypes = {
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
    maxLength: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    value: PropTypes.string
}

export default Editable;
