import { HelperTextComponent } from "@b2bsample/shared/ui/ui-components";
import React from "react";
import { Field } from "react-final-form";
import FormSuite from "rsuite/Form";
import { FormFieldProps } from "../../models/formField/formFieldProps";

export function FormField(props: FormFieldProps) {

    const { name, label, helperText, needErrorMessage, children } = props;

    return (
        <Field
            name={name}
            render={({ input, meta }) => (
                <FormSuite.Group controlId={name}>
                    <FormSuite.ControlLabel>{label}</FormSuite.ControlLabel>

                    {React.cloneElement(children, { ...input })}

                    {
                        helperText
                            ? <HelperTextComponent text={helperText} />
                            : null
                    }

                    {
                        needErrorMessage && meta.error && meta.touched && (<FormSuite.ErrorMessage show={true} >
                            {meta.error}
                        </FormSuite.ErrorMessage>)
                    }

                </FormSuite.Group>
            )}
        />
    );
};

export default FormField;
