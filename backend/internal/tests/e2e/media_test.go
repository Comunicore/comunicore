package e2e

import (
	// "net/http"
	"fmt"
	"net/http"
	"os"
	"testing"

	"github.com/gavv/httpexpect/v2"
)

func TestMediaUpload(t *testing.T) {
	user := testUserCreateOk(t, globalConfig.URL)
	sessionCookie := testAuthLoginOk(t, globalConfig.URL, user)
	testMediaUploadOk(t, globalConfig.URL, sessionCookie)
}

func testMediaUploadOk(t *testing.T, baseURL string, sessionCookie *http.Cookie) {
	t.Run("Test MediaUpload OK", func(t *testing.T) {
		exp := expectCreate(t, baseURL)
		auth := exp.Builder(func(req *httpexpect.Request) {
			req.WithCookie(sessionCookieName, sessionCookie.Value)
		})
		cwd, err := os.Getwd()
		if err != nil {
			t.Fatalf("failed to get current working directory: %v", err)
		}
		fmt.Printf("cwd %s\n", cwd)
		res := auth.POST("/api/media").WithMultipart().
			WithFile("content", "./img/cat_and_snake.png").
			Expect().
			Status(http.StatusOK)

		response := res.JSON().Object()
		response.Keys().ContainsOnly("fileName", "url")
		response.Value("fileName").String().IsEqual("cat_and_snake.png")
		response.Value("url").String().NotEmpty()
	})
}
