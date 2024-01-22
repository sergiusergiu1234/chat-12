
const STYLES =['btn--primary', 'btn--outline' , 'btn--simple'];
const SIZES =['btn--medium', 'btn--large'];

const Button = ({children,type,onClick,buttonStyle,buttonSize,linkTo, disabled}:any) => {

    const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0];
    const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];
    
    return (
        <div>
            <button
            onClick={onClick}
            className={`btn ${checkButtonStyle} ${checkButtonSize}`}
            type={type}
            disabled={disabled}>
                {children}
            
            </button>
        </div>
    )
}

export default Button;