package exceptions.tokenerrors;

import exceptions.BadRequestParentException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class AuthorizationPending extends BadRequestParentException {

    public AuthorizationPending(String var1) {

        super(var1);

    }
}